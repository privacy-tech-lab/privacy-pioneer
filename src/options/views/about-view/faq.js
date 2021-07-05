import React from "react";

export const FAQ = {
  "Do you collect any of my data?": (
    <text>
      Absolutely not! We will not store any data outside of your browser.Feel
      free to check the source code of ___ at ___.
    </text>
  ),
  "How does ___ process my data?": (
    <text>
      ___ stores all of its data in your browser’s storage. That means that all
      data which ____ collects and displays to you within its popup or options
      page stays on your computer and is never seen by us or anyone other than
      yourself.
    </text>
  ),
  "Do I need an account to use ___?": <text>Nope, just go ahead. :).</text>,
  "Who are you?": (
    <text>
      We are academic researchers at Wesleyan University’s{" "}
      <a href="https://www.privacytechlab.org/">privacy-tech-lab</a>. We believe
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
      Using just a few lines of code, buried among functionality that make the
      website work, a site can send your browsing history, location, and other
      information to third party sites they integrate, for example, ad networks.
      Technically, this works through a process called redirection. When you
      visit a website, it can tell your browser to also visit other sites to
      fetch an ad. Through this ad it can then track you.
    </text>
  ),
  "What is ___ actually doing?": (
    <text>
      ____ analyzes HTTP requests, responses, and related data, and stores
      tracking information in a textual format in your browser’s secure storage.
      ___ then informs you when privacy-invasive procedures have occurred. Note
      that ____ does not stop these procedures; ____ is an informative browser
      extension intending to give you greater understanding of these processes
      on the web. If you want to block tracking you will need an ad or tracking
      blocker extension.
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
  "Is ____ compatible with Firefox’s built-in blocking technologies?": (
    <text>
      Yes, ___ is completely compatible with Firefox’s built-in blocking
      technologies. ___ analyzes the HTTP requests that are made, no matter what
      other blocking you have enabled.
    </text>
  ),
  "What is the ____ license? Where can I find the ____ source code?": (
    <text>
      ___ is licensed under the{" "}
      <a href="https://mit-license.org/">MIT license</a>. The ___ source code
      can be found on the{" "}
      <a href="https://github.com/privacy-tech-lab/integrated-privacy-analysis">
        {" "}
        privacy-tech-lab’s ____ GitHub
      </a>
      .
    </text>
  ),
  "Where can I reach you?": (
    <text>
      Send us an email at [email address]. We would love to hear from you! You
      can also learn more about our work at{" "}
      <a href="https://www.privacytechlab.org/"> privacy-tech-lab</a>.
    </text>
  ),
};
