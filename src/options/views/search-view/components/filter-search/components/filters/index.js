/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useState } from "react";
import { CompanyLogoSVG } from "../../../../../../../libs/icons/company-icons";
import { SFilterRow, SFilterRowItem, SCompaniesButton } from "./style";
import { permissionEnum, settingsModelsEnum } from "../../../../../../../background/analysis/classModels";
import * as Icons from "../../../../../../../libs/icons";
import { getAnalyticsStatus } from "../../../../../../../libs/indexed-db/settings";
import { handleClick } from "../../../../../../../libs/indexed-db/getAnalytics";

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
  getEmptyCompanyFilter,
}) => {
  const noCompaniesSelected = () => {
    for (const value of Object.values(companyFilter)) {
      if (value === true) return false;
    }
    return true;
  };
  const noPermsSelected = () => {
    for (const value of Object.values(permFilter)) {
      if (value === false) return false;
    }
    return true;
  };
  const [showCompanies, setShowCompanies] = useState(false);
  return (
    <>
      <SFilterRow show={true}>
        {Object.values(permissionEnum).map((permission) => (
          <SFilterRowItem
            onClick={() => {
              permFilter[permission] = !permFilter[permission];
              setPermFilter(permFilter);
              filterLabels();
              const getAnalysis = async () => {
                const status = await getAnalyticsStatus();
                if (status == true) {
                  handleClick(
                    permission.toString() +
                      " Filter Button Activated: " +
                      permFilter[permission].toString(),
                    "History",
                    settingsModelsEnum.notApplicable,
                    settingsModelsEnum.notApplicable,
                    Object.values(permFilter)
                  );
                }
              };
              getAnalysis();
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
            setShowCompanies(!showCompanies);
            const getAnalysis = async () => {
              const status = await getAnalyticsStatus();
              if (status == true) {
                handleClick(
                  "Companies Filter Button",
                  "History",
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable
                );
              }
            };
            getAnalysis();
          }}
          key={"Companies"}
          highlight={showCompanies}
        >
          <SCompaniesButton
            onClick={() => {
              Object.keys(companyFilter).map((company) => {
                companyFilter[company] = false;
              });
              setCompanyFilter(companyFilter);
              // filterLabels()
            }}
          >
            {"Companies"}
          </SCompaniesButton>
        </SFilterRowItem>
        {noCompaniesSelected() && noPermsSelected() ? null : (
          <SFilterRowItem highlight>
            <SCompaniesButton
              onClick={() => {
                Object.keys(permFilter).forEach(
                  (perm) => (permFilter[perm] = true)
                );
                Object.keys(companyFilter).forEach(
                  (company) => (companyFilter[company] = false)
                );
                setPermFilter(permFilter);
                setCompanyFilter(companyFilter);
                filterLabels();
                const getAnalysis = async () => {
                  const status = await getAnalyticsStatus();
                  if (status == true) {
                    handleClick(
                      "Reset Filter",
                      "History",
                      settingsModelsEnum.notApplicable,
                      settingsModelsEnum.notApplicable,
                      Object.values(permFilter)
                    );
                  }
                };
                getAnalysis();
              }}
            >
              Reset Filter
            </SCompaniesButton>
          </SFilterRowItem>
        )}
      </SFilterRow>
      <SFilterRow show={showCompanies}>
        {Object.entries(CompanyLogoSVG).map(([parent, logo]) => (
          <SFilterRowItem
            onClick={() => {
              companyFilter[parent] = !companyFilter[parent];
              setCompanyFilter(companyFilter);
              filterLabels();
              const getAnalysis = async () => {
                const status = await getAnalyticsStatus();
                if (status == true) {
                  handleClick(
                    parent.toString() +
                      " Company Filter Activated: " +
                      companyFilter[parent].toString(),
                    "History",
                    settingsModelsEnum.notApplicable,
                    Object.values(companyFilter)
                  );
                }
              };
              getAnalysis();
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
  );
};

export default Filters;
