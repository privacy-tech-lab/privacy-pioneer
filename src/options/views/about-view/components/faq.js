/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react"

/**
 * File for all of the questions and answers for the FAQ Page
 * Done in this file format in order to maintain links
 */
export const FAQ = {
  "Does Privacy Pioneer collect any of my data?": (
    <text>
      Absolutely not! Our extension is entirely local to your computer—we do not
      store any data outside of your browser. Feel free to check the source code
      of Privacy Pioneer at{" "}
      <a
        href="https://github.com/privacy-tech-lab/privacy-pioneer"
        target="_blank"
      >
        Privacy Pioneer's GitHub
      </a>
      .
    </text>
  ),
  "How does Privacy Pioneer process my data?": (
    <text>
      Privacy Pioneer stores all of its data in your browser’s storage. That
      means that all data which Privacy Pioneer collects and displays to you
      within its popup or options page stays on your computer and is never seen
      by us or anyone else.
    </text>
  ),
  "Do I need an account to use Privacy Pioneer?": (
    <text>Nope, just go ahead. :).</text>
  ),
  "Who are you?": (
    <text>
      We are academic researchers at Wesleyan University’s{" "}
      <a href="https://www.privacytechlab.org/" target="_blank">
        privacy-tech-lab
      </a>
      . We believe in privacy as a fundamental right. Our motivation is to
      provide new directions in privacy technologies, and we do not have any
      commercial interests.
    </text>
  ),
  "How does the web actually work?": (
    <text>
      The web uses HTTP (HyperText Transfer Protocol) requests for communication
      between websites. HTTP utilizes a client-server model. When you visit a
      website, your computer (the client) sends a request to the website (the
      server) for the content you want to see. The server then processes your
      request and responds with the requested content and related information.
    </text>
  ),
  "How can a website track me without my knowledge?": (
    <text>
      Every time you load a web page, up to hundreds of requests between your
      computer and the website you loaded take place. These requests can pass
      all kinds of data, including your location, IP address, or an identifier
      to track your activity across browsing sessions. Such requests could be
      initiated by the server you intended, say abc.com, but can also be
      initiated by third parties: abc.com initiates a request from def.com.
    </text>
  ),
  "What is Privacy Pioneer actually doing?": (
    <text>
      Privacy Pioneer analyzes HTTP requests, responses, and related data, and
      stores tracking information in a textual format in your browser’s secure
      storage. Privacy Pioneer then informs you when privacy-invasive procedures
      have occurred with the appropriate labels. Note that Privacy Pioneer does
      not block or intervene with these procedures; Privacy Pioneer is an
      information-focused browser extension intending to give you greater
      understanding of the web. If you want to block tracking or ad services in
      the first place, consider tools like&nbsp;
      <a
        href="https://addons.mozilla.org/en-US/firefox/addon/disconnect/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search"
        target="_blank"
      >
        Disconnect
      </a>
      ,&nbsp;
      <a href="https://privacybadger.org/" target="_blank">
        Privacy Badger
      </a>
      ,&nbsp;
      <a
        href="https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/"
        target="_blank"
      >
        uBlockOrigin
      </a>
      , or a proxy service.
    </text>
  ),
  "What are first and third party websites?": (
    <text>
      A first party website means the website that you actually navigated to.
      This is the website that appears in the url/search bar and adisplays on
      your browser. First party websites may redirect your browser to also make
      HTTP requests to other sites, called third party sites. While the HTTP
      requests to third party sites are being made, information containing your
      data may be sent without your knowledge.
    </text>
  ),
  "Is Privacy Pioneer compatible with Firefox’s built-in blocking technologies?":
    (
      <text>
        Yes, Privacy Pioneer is completely compatible with Firefox’s built-in
        blocking technologies. Privacy Pioneer analyzes the HTTP requests that
        are made, no matter what other blocking you have enabled.
      </text>
    ),
  "What is the Privacy Pioneer license? Where can I find the Privacy Pioneer source code?":
    (
      <text>
        Privacy Pioneer is licensed under the{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
        >
          Creative Commons Attribution-NonCommercial-ShareAlike 4.0
          International license
        </a>
        . The Privacy Pioneer source code can be found on the{" "}
        <a
          href="https://github.com/privacy-tech-lab/privacy-pioneer"
          target="_blank"
        >
          {" "}
          privacy-tech-lab’s Privacy Pioneer GitHub
        </a>
        .
      </text>
    ),
  "Where can I reach you?": (
    <text>
      Send us an email at sebastian@privacytechlab.org. We would love to hear
      from you! You can also learn more about our work at{" "}
      <a href="https://www.privacytechlab.org/" target="_blank">
        {" "}
        privacy-tech-lab
      </a>
      .
    </text>
  ),
}
