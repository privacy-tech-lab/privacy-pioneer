/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import { Collapse } from "bootstrap"
import {
  SAnswer,
  SBody,
  SQuestion,
  STitle,
  SContainer,
  SSubtitle,
  SQuestionCard,
  SArrow,
} from "./style"
import { FAQ } from "./faq"
import { ArrowDown } from "../../../libs/icons"
import { aboutSteps, AboutTour } from "../../../libs/tour"
/**
 * About page view
 */
const AboutView = () => {
  const QuestionCard = ({ question, answer }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
      var faqCollapse = document.getElementById(question)
      var collapse = new Collapse(faqCollapse, { toggle: false })
      open ? collapse.show() : collapse.hide()
    })

    return (
      <SQuestionCard onClick={() => setOpen(!open)}>
        <SQuestion>
          {question}
          <SArrow>
            <ArrowDown size={24} />
          </SArrow>
        </SQuestion>

        <div className="collapse" id={question}>
          <SAnswer>{answer}</SAnswer>
        </div>
      </SQuestionCard>
    )
  }

  return (
    <Scaffold>
      <SContainer>
        <STitle>About</STitle>
        <SSubtitle>Learn more about our extension</SSubtitle>
        <SBody>
          Privacy Pioneer will inform you which websites are tracking you and
          what data they collect.
        </SBody>
        <STitle>FAQ</STitle>
        <SBody>
          {Object.entries(FAQ).map(([question, answer], index) => (
            <QuestionCard question={question} answer={answer} key={index} />
          ))}
        </SBody>
      </SContainer>
      <AboutTour steps={aboutSteps}/>
    </Scaffold>
  )
}

export default AboutView
