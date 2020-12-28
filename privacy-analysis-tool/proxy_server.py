from selenium import webdriver
from browsermobproxy import Server
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoSuchWindowException
from selenium.common.exceptions import WebDriverException
from pathlib import Path
import time
import json
from json.decoder import JSONDecodeError
import os
from urllib.parse import urlparse
import yaml
import sys

def getFilePath(relativePath):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    if getattr(sys, 'frozen', False):
        application_path = sys._MEIPASS
        return os.path.join(application_path, relativePath[3:])
    else:
        application_path = os.path.dirname(__file__)
        return os.path.join(application_path, relativePath)

def importYaml():
    """
    Imports yaml file with all keywords we are going to look for in the network
    requests. YAML file is titled keywords.
    """
    kw = getFilePath('keywords.yaml')
    with open(kw, 'r') as evidence:
        keys_yml = yaml.safe_load(evidence)

    keywords_data = {}

    types = ["LOCATION", "FINGERPRINT", "PIXEL"]

    for type in types:
        data = {}
        for aspect in ["Bodies", "URLs"]:
            data[aspect] = keys_yml[type][aspect]


        keywords_data[type] = data

    return keywords_data

def analyze_requests(requests, keywords):
    """
    Developer has now clicked through their website and we have logged the
    network requests. In this function we take those requests and look for
    keywords or URLs
    """
    for req in requests:
        # first get sections for later analysis
        url = requests[req]['request']['url']

        try:
            headers = str(requests[req]['request']['headers'])
        except KeyError:
            headers = ""
        try:
            postData = str(requests[req]['request']['postData'])
        except KeyError:
            postData = ""

        # check URL of request to see if recognized
        for t in keywords:
            for u in keywords[t]['URLs']:
                if url in u:
                    print("Found a matching URL for " + type)
                    print(u)

        for t in keywords:
                for b in keywords[t]['Bodies']:
                    if b in postData:
                        print("Found a matching keyword in post data: " + b + " for " + t)
                    if b in headers:
                        print("Found a matching keyword in header: " + b + " for " + t)

def setUpSelenium():
    """
    This sets up our selenium profile, our server, and our proxy for browsing
    and analysis purposes.
    """
    # set up webdriver and proxy server
    profile  = webdriver.FirefoxProfile()
    profile.accept_untrusted_certs = True
    # This checks for the scripts current path, and in this same path there should
    # be the browsermob-proxy files, which is where we then direct the script
    # to find the server
    curr_dir_server = getFilePath('browsermob-proxy/bin/browsermob-proxy')
    server = Server(path=curr_dir_server)
    server.start()

    proxy = server.create_proxy()
    profile.set_proxy(proxy.selenium_proxy())
    driver = webdriver.Firefox(firefox_profile=profile, executable_path=r'./geckodriver')

    # attach extension to interface with user
    extension_dir = getFilePath('extension/dist/extension.xpi')
    driver.install_addon(str(Path(extension_dir).absolute()))

    return (proxy, driver, server)

def getProxyInfo(c, reqs, proxy):
    """
    function to get the proxy info and put all POST requests into our json object
    """
    result_har = proxy.har # returns a HAR JSON blob
    for ent in result_har['log']['entries']:
        if ent['request']['method'] == 'POST':
            reqs[str(c)] = ent

            c += 1

    return (c, reqs)

def setUpNetworkMonitoring(proxy, driver, site, counter, requests):
    """
    This function gets the proxy har to be stored in JSON format for analysis.
    It will termiante when user closes the browser.
    """
    # Create har for analysis, name of site will be completed by user earlier on
    proxy.new_har(site,options={'captureHeaders': True,'captureContent':True})

    # get initial URL where user naviagtes
    current_loc = driver.current_url
    urls = [current_loc]
    # get initial web traffic info on first page
    (counter, requests) = getProxyInfo(counter, requests, proxy)

    # Loop for while the user is still clicking through links within website,
    # will append network logs to our json object
    # Once user is done, they can exit out the browser and will be done. We should
    # also probably have some button they can click.
    analyzing = True
    while analyzing:
        try:
            ## this is just to record all of the different URLs a user goes to
            new_loc = driver.current_url
            if new_loc != current_loc:
                current_loc = new_loc
                urls.append(current_loc)
                print("User has navigated to a new URL: " + new_loc)
            else:
                pass

            time.sleep(1)
            # every second get the new network requests
            (counter, requests) = getProxyInfo(counter, requests, proxy)

        # this catches when the user hard exits or closes the browser so our app
        # does not break
        except (NoSuchWindowException, WebDriverException):
            print('You have closed the browser. Will now begin analysis..')
            analyzing = False

    return requests

def main():
    """
    This is the main function where all of the main calls are made.
    """
    # this is a placeholder for some sort of GUI when we create the app
    site = input("What's the name of the site you are visiting? ")
    # first we're gonna make our json file of network calls to analyze and make sure
    # it is empty for testing purposes
    with open("network-logs.json", 'w'): pass

    # this function sets up our browser viewing with selenium
    (proxy, driver, server) = setUpSelenium()

    #global counter variable to label each network request differently and to
    # keep JSON object stored of all network requests to later be dumped into
    # file for analysis
    counter = 0
    requests = {}

    # upload network request keywords from yaml
    yaml_keywords = importYaml()

    # set up proxy and begin to monitor developer moves
    requests = setUpNetworkMonitoring(proxy, driver, site, counter, requests)

    # saves network logs for debug
    with open('network-logs.json', 'a') as outfile:
        json.dump(requests, outfile)

    # user has exited the browser so is done navigating. Now we can begin analysis.
    analyze_requests(requests, yaml_keywords)

    server.stop()
    driver.quit()

if __name__ == "__main__":
    main()
