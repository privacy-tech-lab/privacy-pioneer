import React, { useState } from "react"
import { filterLabelObject } from "./filterLabels"
import { CompanyLogoSVG } from "../../../../../../libs/icons/company-icons"
import { SFilterRow, SFilterRowItem, SCompaniesButton } from "./style"
import { permissionEnum } from "../../../../../../background/analysis/classModels"
import * as Icons from "../../../../../../libs/icons"

const Filters = ({
  query,
  getPlaceholder,
  setPlaceholder,
  filter,
  permFilter,
  webLabels,
  allWebsites,
  allLabels,
  setPermFilter,
  setFilter,
  setWebLabels,
}) => {
  const getEmptyCompanyFilter = () => {
    var mapping = {}
    Object.keys(CompanyLogoSVG).map((company) => {
      mapping[company] = false
    })
    return mapping
  }

  /**
   * Looks for filters and applies them as appropriate.
   *
   * @param {string} keyString
   */
  const filterLabels = (labels = allLabels) => {
    // filter gets passed as an array in DB call
    var runFilter = false
    var runCompanyFilter = false

    for (const bool of Object.values(permFilter)) {
      if (!bool) {
        runFilter = true
        break
      }
    }

    for (const bool of Object.values(companyFilter)) {
      if (bool) {
        runCompanyFilter = true
        break
      }
    }

    setPlaceholder(getPlaceholder(runCompanyFilter))

    if (runFilter || runCompanyFilter) {
      const filtered = filterLabelObject(
        labels,
        permFilter,
        companyFilter,
        runCompanyFilter
      )
      setWebLabels(filtered)
      console.log(webLabels)
      filter(query, filtered)
    } else {
      setWebLabels(labels)
      setFilter(allWebsites)
      filter(query, labels)
    }
  }

  const [companyFilter, setCompanyFilter] = useState(getEmptyCompanyFilter())
  const [showCompanies, setShowCompanies] = useState(false)

  return (
    <>
      <SFilterRow show={true}>
        {Object.values(permissionEnum).map((permission) => (
          <SFilterRowItem
            onClick={() => {
              permFilter[permission] = !permFilter[permission]
              setPermFilter(permFilter)
              filterLabels()
            }}
            key={permission}
            highlight={permFilter[permission]}
          >
            {Icons.getLabelIcon(permission, "21px")}
            {permission.charAt(0).toUpperCase().concat(permission.slice(1))}
          </SFilterRowItem>
        ))}
        <SFilterRowItem
          onClick={() => {
            setShowCompanies(!showCompanies)
          }}
          key={"Companies"}
          highlight={showCompanies}
        >
          <SCompaniesButton
            onClick={() => {
              Object.keys(companyFilter).map((company) => {
                companyFilter[company] = false
              })
              setCompanyFilter(companyFilter)
              filterLabels()
            }}
          >
            {"Companies"}
          </SCompaniesButton>
        </SFilterRowItem>
      </SFilterRow>
      <SFilterRow show={showCompanies}>
        {Object.entries(CompanyLogoSVG).map(([parent, logo]) => (
          <SFilterRowItem
            onClick={() => {
              companyFilter[parent] = !companyFilter[parent]
              setCompanyFilter(companyFilter)
              filterLabels()
            }}
            key={parent}
            highlight={companyFilter[parent]}
            data-tip={parent}
            data-place={"bottom"}
            data-delay-show={500}
          >
            {logo({ size: "21px" })}
          </SFilterRowItem>
        ))}
      </SFilterRow>
    </>
  )
}

export default Filters
