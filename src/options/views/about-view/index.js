import React from "react";
import Scaffold from "../../components/scaffold";
import { SAnswer, SBody, SQuestion, STitle } from "./style";
import { SContainer, SSubtitle } from "./style";

/**
 * About page view
 */
const AboutView = () => {
  return (
    <Scaffold>
      <SContainer>
        <STitle>About</STitle>
        <SSubtitle>Learn more about our extension</SSubtitle>
        <SBody>
          ____ makes it transparent which websites are tracking you and which
          data they collect.
        </SBody>
        <br />
        <STitle>FAQ</STitle>
        <SQuestion>Do you collect any of my data?</SQuestion>
        <SAnswer>
          Absolutely not! We will not store any data outside of your browser.
          Feel free to check the source code of ___ at ___.
        </SAnswer>
        <SQuestion>How does ___ process my data?</SQuestion>
        <SAnswer>
          ___ stores all of its data in your browser’s storage. That means that
          all data which ____ collects and displays to you within its popup or
          options page stays on your computer and is never seen by us or anyone
          other than yourself.
        </SAnswer>
        <SQuestion>Do I need an account to use ___?</SQuestion>
        <SAnswer>Nope, just go ahead. :)</SAnswer>
        <SQuestion>Who are you?</SQuestion>
        <SAnswer>
          We are academic researchers at Wesleyan University’s
          [privacy-tech-lab](https://www.privacytechlab.org/). We believe in
          privacy as a fundamental right. Our motivation is to provide new
          directions in privacy technologies, and we do not have any commercial
          interests.
        </SAnswer>
        <SQuestion>How does the web actually work?</SQuestion>
        <SAnswer>
          The web uses HTTP (HyperText Transfer Protocol) requests for
          communication between websites. HTTP utilizes a client-server model.
          When you visit a website, your computer (the client) sends a request
          to the website (the server) for the content you want to see. The
          server then processes your request and responds with the requested
          content and related information.
        </SAnswer>
        <SQuestion>How can a website track me without my knowledge?</SQuestion>
        <SAnswer>
          Using just a few lines of code, buried among functionality that makes
          the website work, a site can send your browsing history, location, and
          other information to third party sites they integrate, for example, ad
          networks. Technically, this works through a process called
          redirection. When you visit a website, it can tell your browser to
          also visit other sites to fetch an ad. Through this ad it can then
          track you.
        </SAnswer>
        <SQuestion>What is ___ actually doing?</SQuestion>
        <SAnswer>
          ____ analyzes HTTP requests, responses, and related data, and stores
          tracking information in a textual format in your browser’s secure
          storage. ___ then informs you when privacy-invasive procedures have
          occurred. Note that ____ does not stop these procedures; ____ is an
          informative browser extension intending to give you greater
          understanding of these processes on the web. If you want to block
          tracking you will need an ad or tracking blocker extension.
        </SAnswer>
        <SQuestion> What are first and third party websites? </SQuestion>
        <SAnswer>
          A first party website means the website that you actually navigated
          to. This is the website that appears in the url/search bar and
          displays on your browser. First party websites may redirect your
          browser to also make HTTP requests to other sites, called third party
          sites. While the HTTP requests to third party sites are being made,
          information containing your data may be sent without your knowledge.
        </SAnswer>
        <SQuestion>
          Is ____ compatible with Firefox’s built-in blocking technologies?
        </SQuestion>
        <SAnswer>
          Yes, ___ is completely compatible with Firefox’s built-in blocking
          technologies. ___ analyzes the HTTP requests that are made, no matter
          what other blocking you have enabled.
        </SAnswer>
        <SQuestion>
          What is the ____ license? Where can I find the ____ source code?
        </SQuestion>
        <SAnswer>
          ___ is licensed under the [MIT license](https://mit-license.org/). The
          ___ source code can be found on the [privacy-tech-lab’s ____
          GitHub](https://github.com/privacy-tech-lab/integrated-privacy-analysis).
        </SAnswer>
        <SQuestion>Where can I reach you?</SQuestion>
        <SAnswer>
          Send us an email at [email address]. We would love to hear from you!
          You can also learn more about our work at
          [privacy-tech-lab](https://www.privacytechlab.org/).
        </SAnswer>
      </SContainer>
    </Scaffold>
  );
};

export default AboutView;
