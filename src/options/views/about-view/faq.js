import React from "react";

export const FAQ = {
  "Does ___ collect any of my data?": (
    <text>
      Absolutely not! Our extension is entirely local to your computer—we do not
      store any data outside of your browser. Feel free to check the source code
      of ___ at ___.
    </text>
  ),
  "How does ___ process my data?": (
    <text>
      ___ stores all of its data in your browser’s storage. That means that all
      data which ___ collects and displays to you within its popup or options
      page stays on your computer and is never seen by us or anyone else.
    </text>
  ),
  "Do I need an account to use ___?": <text>Nope, just go ahead. :).</text>,
  "Who are you?": (
    <text>
      We are academic researchers at Wesleyan University’s{" "}
      <a href="https://www.privacytechlab.org/" target="_blank">privacy-tech-lab</a>. We believe
      in privacy as a fundamental right. Our motivation is to provide new
      directions in privacy technologies, and we do not have any commercial
      interests.
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
  "What is ___ actually doing?": (
    <text>
      ___ analyzes HTTP requests, responses, and related data, and stores
      tracking information in a textual format in your browser’s secure storage.
      ___ then informs you when privacy-invasive procedures have occurred with
      the appropriate labels. Note that ___ does not block or intervene with
      these procedures; ___ is an information-focused browser extension
      intending to give you greater understanding of the web. If you want to
      block tracking in the first place, consider tools like Privacy Badger,
      uBlockOrigin, or a proxy service.
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
  "Is ___ compatible with Firefox’s built-in blocking technologies?": (
    <text>
      Yes, ___ is completely compatible with Firefox’s built-in blocking
      technologies. ___ analyzes the HTTP requests that are made, no matter what
      other blocking you have enabled.
    </text>
  ),
  "What is the ___ license? Where can I find the ___ source code?": (
    <text>
      ___ is licensed under the{" "}
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
        Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
        license
      </a>
      . The ___ source code can be found on the{" "}
      <a href="https://github.com/privacy-tech-lab/integrated-privacy-analysis" target="_blank">
        {" "}
        privacy-tech-lab’s ___ GitHub
      </a>
      .
    </text>
  ),
  "Where can I reach you?": (
    <text>
      Send us an email at [email address]. We would love to hear from you! You
      can also learn more about our work at{" "}
      <a href="https://www.privacytechlab.org/" target="_blank"> privacy-tech-lab</a>.
    </text>
  ),
};
