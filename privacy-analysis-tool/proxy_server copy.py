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

js = getFilePath('services.json')
with open(js) as json_file:
    data = json.load(json_file)
    advertising = data['categories']['Advertising']
    analytics = data['categories']['Analytics']
    fingerprint = data['categories']['FingerprintingInvasive']
    fingerprint2 = data['categories']['FingerprintingGeneral']
    social = data['categories']['Social']
    # print(advertising)
    for a in advertising:
        for b in a:
            for u in list(a[b].values())[0]:
                print(u)

        # print(advertising[a])
