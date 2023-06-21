import React from 'react';
import Scaffold from '../../components/scaffold';
import NavBar from '../../components/nav-bar';
import * as Icons from "../../../libs/icons";
import { SLeading } from "./style";
import { privacyLabels, settingsModelsEnum } from '../../../background/analysis/classModels';
import { getAnalyticsStatus } from '../../../libs/indexed-db/settings';
import { handleClick } from '../../../libs/indexed-db/getAnalytics';

class PrivacyPolicyAnalyzer extends React.Component {
  analyzePrivacyPolicy() {
    // Define the categories, keywords, and patterns for privacy policy analysis
    const privacyPolicyAnalysis = {
      'Personal Information': ['name', 'email', 'geolocation', 'location', 'email address', 'email addresses', 'phone number', 'age', 'gender', 'demographic', 'latitude','longitude', 'fingerprint', 'ad id' ],
      'Usage Data': ['cookies', 'IP address', 'IP', '(IP)', 'browser type', 'operating system'],
      'Third-Party Sharing': ['advertisers', 'advertising', 'pixel'],
      'Data Retention': ['retention period'],
      'Data Security': ['encryption', 'firewall'],
    };

    // Define the negation keywords
    const negationKeywords = ['does not', 'do not', "don't", 'not', 'no'];

    // Function to analyze the privacy policy content
    function analyzePrivacyPolicy(content) {
      const analysisResults = {};

      for (const category in privacyPolicyAnalysis) {
        analysisResults[category] = [];

        const keywords = privacyPolicyAnalysis[category];
        for (const keyword of keywords) {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          const matches = content.match(regex);
          if (matches) {
            for (const match of matches) {
              const sentence = getContainingSentence(content, match);
              const isNegated = negationKeywords.some(keyword => sentence.toLowerCase().includes(keyword));
              if (!isNegated) {
                analysisResults[category].push(keyword);
              }
            }
          }
        }
      }

      return analysisResults;
    }

    // Function to extract the containing sentence for a matched keyword
    function getContainingSentence(content, keyword) {
      const sentences = content.split('.'); // Split content into sentences (assumes sentences end with a period)

      for (const sentence of sentences) {
        if (sentence.includes(keyword)) {
          return sentence.trim();
        }
      }

      return '';
    }
// Function to display the analysis results
function displayAnalysisResults(analysisResults) {
    const processedKeywords = new Set();
    console.log('Privacy Policy Analysis Results:');
    for (const category in analysisResults) {
      const keywords = analysisResults[category];
      if (keywords.length > 0) {
        console.log(`${category}:`);
        keywords.forEach(keyword => {
          if (!processedKeywords.has(keyword)) {
            processedKeywords.add(keyword);
            console.log(`- ${keyword}`);
          }
        });
      }
    }
  }  

    // Retrieve the current tab URL using the browser API (Firefox-specific)
    const querying = browser.tabs.query({ active: true, currentWindow: true });
    querying.then(tabs => {
      const currentTab = tabs[0];
      fetchAndAnalyzePrivacyPolicy(currentTab.url);
    });

    // Fetch the website content and analyze the privacy policy
    function fetchAndAnalyzePrivacyPolicy(url) {
      fetch(url)
        .then(response => response.text())
        .then(privacyPolicyContent => {
          const analysisResults = analyzePrivacyPolicy(privacyPolicyContent);
          displayAnalysisResults(analysisResults);
        })
        .catch(error => {
          console.error('Error fetching and analyzing privacy policy:', error);
        });
    }
  }

  render() {
    return (
      <>
        <button onClick={this.analyzePrivacyPolicy}>Analyze Privacy Policy</button>
        <div id="analysisResults"></div>
      </>
    );
  }
}

export { PrivacyPolicyAnalyzer }