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

def importAnalysisFiles():
    """
    Imports yaml file with all keywords we are going to look for in the network
    requests. YAML file is titled keywords.
    """
    # first we're going to load the yaml we have created
    kw = getFilePath('keywords.yaml')
    with open(kw, 'r') as evidence:
        keys_yml = yaml.safe_load(evidence)

    # Now we're going to load the networks json from
    # https://github.com/disconnectme/disconnect-tracking-protection
    js = getFilePath('services.json')
    with open(js) as json_file:
        data = json.load(json_file)
        advertising = data['categories']['Advertising']
        analytics = data['categories']['Analytics']
        fingerprint = data['categories']['FingerprintingInvasive']
        fingerprint2 = data['categories']['FingerprintingGeneral']
        social = data['categories']['Social']

    keywords_data = {}

    types = ["LOCATION", "FINGERPRINT", "PIXEL", "ADVERTISING", "ANALYTICS", "SOCIAL"]

    for type in types:
        data = {}
        # just load body keywords from the yaml we have made
        data["Bodies"] = keys_yml[type]["Bodies"]

        # for urls, we can get a lot of our data from services.json file
        if type == "ADVERTISING":
            lst = keys_yml[type]["URLs"]
            for a in advertising:
                for b in a:
                    for u in list(a[b].values())[0]:
                        lst.append(u)
            data["URLs"] = lst

        elif type == "FINGERPRINT":
            lst = keys_yml[type]["URLs"]
            for a in fingerprint:
                for b in a:
                    for u in list(a[b].values())[0]:
                        lst.append(u)
            for a in fingerprint2:
                for b in a:
                    for u in list(a[b].values())[0]:
                        lst.append(u)

            data["URLs"] = lst

        if type == "ANALYTICS":
            lst = keys_yml[type]["URLs"]
            for a in analytics:
                for b in a:
                    for u in list(a[b].values())[0]:
                        lst.append(u)

            data["URLs"] = lst

        if type == "SOCIAL":
            lst = keys_yml[type]["URLs"]
            for a in social:
                for b in a:
                    for u in list(a[b].values())[0]:
                        lst.append(u)

            data["URLs"] = lst

        else: # nothing to load from json
            data["URLs"] = keys_yml[type]["URLs"]

        keywords_data[type] = data

    return keywords_data

def analyze_requests(requests, keywords, urls):
    """
    Developer has now clicked through their website and we have logged the
    network requests. In this function we take those requests and look for
    keywords or URLs
    """
    debug = False
    # saves network logs for debug purposes
    with open('network-logs.json', 'a') as outfile:
        json.dump(requests, outfile)

    navigation_secure = True
    # first let's check if any of the urls user has navigated to are http.
    for u in urls:
        if u == "about:blank" or "https" in u:
            pass # safe
        else:
            navigation_secure = False

    if debug:
        pass
    else:
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
                    if u in url:
                        print("Found a matching URL for " + t)
                        print(url)
                    # make sure url is encrypted
                    if "https" not in url:
                        print("The request sent is unencrypted!")
                        print(url)

            for t in keywords:
                    for b in keywords[t]['Bodies']:
                        if b in postData:
                            print("Found a matching keyword in post data: " + b + " for " + t)
                        if b in headers:
                            print("Found a matching keyword in header: " + b + " for " + t)

    if not navigation_secure:
        print("Detected navigation to non-HTTPS site")

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

def stopDataCollection(server, driver, requests, keywords, urls):
    """
    User has closed out so this function stops our server and webdriver. Should
    be connected to a stop button.
    After closing server, we should begin analysis
    """
    server.stop()
    driver.quit()

    # user has stopped browsing. Now we can begin analysis.
    analyze_requests(requests, keywords, urls)

def startDataCollection(proxy, driver, site, server, keywords):
    """
    This function creates the new har from the proxy server to begin data
    collection. Will continue monitoring until user exits or clicks stop button.
    Once that occurs, this function calls stopDataCollection() to quit
    the driver and server, and then begin analyzing the data that has been
    collected
    """
    # global counter variable to label each network request differently and to
    # keep JSON object stored of all network requests to later be dumped into
    # file for analysis
    counter = 0
    requests = {}

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
            stopDataCollection(server, driver, requests, keywords, urls)
            analyzing = False

        # Other than them quitting out, we should also have a button somewhere
        # for user to click, which would then call stopDataCollection

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

    # upload network request keywords from yaml
    keywords = importAnalysisFiles()

    startDataCollection(proxy, driver, site, server, keywords)

if __name__ == "__main__":
    main()
