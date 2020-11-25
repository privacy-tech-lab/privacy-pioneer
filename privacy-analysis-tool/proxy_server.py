from selenium import webdriver
from browsermobproxy import Server
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoSuchWindowException
from selenium.common.exceptions import WebDriverException
import time
import json
import os
from urllib.parse import urlparse

# first we're gonna make our json file of network calls to analyze and make sure
# it is empty for testing purposes
with open('network-logs.json', 'w') as outfile:
    outfile.write("")

# set up webdriver and proxy server
profile  = webdriver.FirefoxProfile()
profile.accept_untrusted_certs = True
# This is currently set to my computer's location. You must switch this for testing on
# different devices. This will be fixed when we release the app.
server = Server("/Users/Rafaelg/Desktop/integrated-privacy-analysis/privacy-analysis-tool/browsermob-proxy/bin/browsermob-proxy")
server.start()
proxy = server.create_proxy(params={'trustAllServers':'true'})
profile.set_proxy(proxy.selenium_proxy())
capabilities = webdriver.DesiredCapabilities().FIREFOX
capabilities['acceptSslCerts'] = True
driver = webdriver.Firefox(capabilities=capabilities, firefox_profile=profile)


# get initial URL from user
url = input("Input your website URL: ")
title = urlparse(url).netloc.split("www.")
# Create har for analysis
proxy.new_har(title,options={'captureHeaders': True,'captureContent':True})

# function to get the proxy info and put all POST requests into our saved file
def getProxyInfo():
    result_har = proxy.har # returns a HAR JSON blob
    for ent in result_har['log']['entries']:
        if ent['request']['method'] == 'POST':
            with open('network-logs.json', 'a') as outfile:
                json.dump(ent, outfile)
                outfile.write(os.linesep)
                # _response = ent['request']
                # _content = _response['content']['text']

# Go to URL
driver.get(url)
current_loc = driver.current_url
# get initial web traffic info on first page
getProxyInfo()


# Loop for while the user is still clicking through links within website,
# will append network logs to our json file
# Once user is done, they can exit out the browser and will be done. We should
# also probably have some button they can click.
analyzing = True
while analyzing:
    try:
        ## let user navigate to new screen
        ## if new screen is loaded, get new proxy info
        new_loc = driver.current_url
        if new_loc != current_loc:
            current_loc = new_loc
            getProxyInfo()
            print("You have navigated to a new URL: " + new_loc)
        else:
            getProxyInfo()

        time.sleep(1)

    # this catches when the user hard exits or closes the browser so our app
    # does not break
    except (NoSuchWindowException, WebDriverException):
        print('You have closed the browser. Will now begin analysis..')
        analyzing = False

server.stop()
driver.quit()
