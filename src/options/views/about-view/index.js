/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import Scaffold from "../../components/scaffold";
import { Collapse } from "bootstrap";
import {
  SAnswer,
  SBody,
  SQuestion,
  STitle,
  SContainer,
  SSubtitle,
  SQuestionCard,
  SArrow,
  SAbout,
} from "./style";
import { FAQ } from "./components/faq";
import { ArrowDown } from "../../../libs/icons";
import ReactTooltip from "react-tooltip";
import penguin from "../../../assets/logos/Happy.svg";

/**
 * About page view
 * Uses Collapse from bootstrap to get drop down effect
 */
const AboutView = () => {
  const QuestionCard = ({ question, answer }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      ReactTooltip.hide();
      var faqCollapse = document.getElementById(question);
      var collapse = new Collapse(faqCollapse, { toggle: false });
      open ? collapse.show() : collapse.hide();
    });

    return (
      <SQuestionCard onClick={() => setOpen(!open)}>
        <SQuestion>
          {question}
          <SArrow>
            <ArrowDown size={24} />
          </SArrow>
        </SQuestion>

        <SAnswer className="collapse" id={question}>
          {answer}
        </SAnswer>
      </SQuestionCard>
    );
  };

  return (
    <Scaffold>
      <SContainer>
        <SAbout>
          <div style={{ width: "350px" }}>
            <STitle>About</STitle>
            <SSubtitle>Learn more about our extension</SSubtitle>
            <SBody>
              Privacy Pioneer will inform you which websites are tracking you
              and what data they collect.
            </SBody>
          </div>
          <img src={penguin} />
        </SAbout>
        <STitle>FAQ</STitle>
        <SBody>
          {Object.entries(FAQ).map(([question, answer], index) => (
            <QuestionCard question={question} answer={answer} key={index} />
          ))}
        </SBody>
      </SContainer>
    </Scaffold>
  );
};

export default AboutView;
