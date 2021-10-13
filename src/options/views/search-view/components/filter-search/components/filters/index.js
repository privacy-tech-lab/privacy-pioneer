import React, { useState } from "react"
import { CompanyLogoSVG } from "../../../../../../../libs/icons/company-icons"
import { SFilterRow, SFilterRowItem, SCompaniesButton } from "./style"
import { permissionEnum } from "../../../../../../../background/analysis/classModels"
import * as Icons from "../../../../../../../libs/icons"

/**
 * Filters for search view page. This includes Permissions and stored companies. Adjusts
 * listed websites and permissions depending on selected filters
 */

const Filters = ({
  permFilter,
  setPermFilter,
  companyFilter,
  setCompanyFilter,
  filterLabels,
}) => {
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
