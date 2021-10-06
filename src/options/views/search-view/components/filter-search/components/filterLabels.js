export const filterLabelObject = (
  allLabels,
  permFilter,
  companyFilter = null,
  runCompanyFilter = false
) => {
  const updatedLabels = JSON.parse(JSON.stringify(allLabels))

  for (const [perm, value] of Object.entries(updatedLabels)) {
    if (!permFilter[perm]) {
      delete updatedLabels[perm]
    } else {
      if (runCompanyFilter) {
        for (const [rootUrl, requests] of Object.entries(value)) {
          for (const [url, evLevel] of Object.entries(requests)) {
            for (const [typ, e] of Object.entries(evLevel)) {
              const parent = e.parentCompany
              if (
                parent != null &&
                parent in companyFilter &&
                companyFilter[parent]
              ) {
                //pass
              } else {
                delete updatedLabels[perm][rootUrl][url][typ]
                if (
                  Object.keys(updatedLabels[perm][rootUrl][url]).length == 0
                ) {
                  delete updatedLabels[perm][rootUrl][url]
                  if (Object.keys(updatedLabels[perm][rootUrl]).length == 0) {
                    delete updatedLabels[perm][rootUrl]
                    if (Object.keys(updatedLabels[perm]).length == 0) {
                      delete updatedLabels[perm]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  for (const perm of Object.keys(updatedLabels)) {
    if (Object.keys(updatedLabels[perm]) == 0) {
      delete updatedLabels[perm]
    }
  }
  return updatedLabels
}
