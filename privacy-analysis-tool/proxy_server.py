from selenium import webdriver
from browsermobproxy import Server
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoSuchWindowException
from selenium.common.exceptions import WebDriverException
import time
import json
from json.decoder import JSONDecodeError
import os
from urllib.parse import urlparse

# first we're gonna make our json file of network calls to analyze and make sure
# it is empty for testing purposes
with open("network-logs.json", 'w'): pass

# set up webdriver and proxy server
profile  = webdriver.FirefoxProfile()
profile.accept_untrusted_certs = True
# This checks for the scripts current path, and in this same path there should
# be the browsermob-proxy files, which is where we then direct the script
# to find the server
curr_dir = os.path.dirname(os.path.realpath(__file__))
curr_dir_server = curr_dir + "/browsermob-proxy/bin/browsermob-proxy"
# dict={'port':8090}
server = Server(path=curr_dir_server)
server.start()

proxy = server.create_proxy()
profile.set_proxy(proxy.selenium_proxy())
driver = webdriver.Firefox(firefox_profile=profile)

#global counter variable to label each network request differently and to
# keep JSON object stored of all network requests to later be dumped into
# file for analysis
counter = 0
requests = {}

# Create har for analysis, name of site will be completed by user earlier on
proxy.new_har("name-of-site",options={'captureHeaders': True,'captureContent':True})

# function to get the proxy info and put all POST requests into our saved file
def getProxyInfo(c, reqs):
    result_har = proxy.har # returns a HAR JSON blob
    for ent in result_har['log']['entries']:
        if ent['request']['method'] == 'POST':
            reqs[str(c)] = ent

            c += 1

    return (c, reqs)

# get initial URL where user naviagtes
current_loc = driver.current_url
urls = [current_loc]
# get initial web traffic info on first page
(counter, requests) = getProxyInfo(counter, requests)


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
        (counter, requests) = getProxyInfo(counter, requests)

    # this catches when the user hard exits or closes the browser so our app
    # does not break
    except (NoSuchWindowException, WebDriverException):
        print('You have closed the browser. Will now begin analysis..')
        analyzing = False

# user has exited the browser so is done navigating. Now we can begin analysis.
with open('network-logs.json', 'a') as outfile:
    json.dump(requests, outfile)

server.stop()
driver.quit()
