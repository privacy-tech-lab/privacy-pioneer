import React from "react"
import { privacyLabels } from "../../../../background/analysis/classModels"
import { SContainer, SHeader, SCollapse, SCodeBlock, SBody } from "./style"

/**
 * 'Collapse' containing evidence/extra info about identified label type
 */
const Evidence = ({ collapseId, request, label, type }) => {
  /**
   * Check if value is int
   */
  const isInt = (value) => {
    var x
    if (isNaN(value)) {
      return false
    }
    x = parseFloat(value)
    return (x | 0) === x
  }

  /**
   * Get the identified evidence code snippet
   */
  const getSnippet = (request) => {
    if (
      request != null &&
      request.snippet != null &&
      request.index !== -1 &&
      isInt(request.index[0]) &&
      isInt(request.index[1])
    ) {
      const maxChars = 475
      const data = { leading: "", middle: "", trailing: "" }
      data.middle = request.snippet.slice(request.index[0], request.index[1])

      data.leading = request.snippet.slice(0, request.index[0])
      data.trailing = request.snippet.slice(request.index[1], request.snippet.length)

      data.leading = "... " + data.leading.slice(maxChars * -1)
      data.trailing = data.trailing.slice(0, maxChars) + " ..."

      return data
    } else {
      return null
    }
  }

  /**
   * Get sub label description
   */
  const getDescription = (request) => {
    if (request != null) {
      const description = privacyLabels[label]["types"][type]["description"]
      if (description.length) {
        return description
      } else {
        return "None"
      }
    }
    return ""
  }

  const description = getDescription(request)
  const data = getSnippet(request)

  return (
    <SCollapse className="collapse" id={collapseId}>
      <SContainer className="card card-body">
        <SHeader marginTop="16px">◉ Description</SHeader>
        <SBody>{description}</SBody>
        <SHeader marginTop="16px">◉ Request URL </SHeader>
        <SBody>
          <pre>
            <code>{request != null ? request["requestUrl"] : ""}&nbsp;</code>
          </pre>
        </SBody>
        <SHeader marginTop="16px" marginBottom="8px">
          ◉ Data Snippet
        </SHeader>
        <SCodeBlock>
          <pre>
            {data != null ? (
              <code>
                {data.leading}
                <span>{data.middle}</span>
                {data.trailing}
              </code>
            ) : (
              <code>Unavailable</code>
            )}
          </pre>
        </SCodeBlock>
      </SContainer>
    </SCollapse>
  )
}

export default Evidence
