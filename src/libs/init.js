import ReactTooltip from "react-tooltip"
import { getWebsites, getLabels } from "./indexed-db/getIdbData"
import exData from "./tour/exData.json"
import { getTourStatus } from "./indexed-db/settings"
import { filterLabelObject, getPermMapping } from "../options/views/search-view/components/filter-search/components/filterLabels.js"

/**
 *
 * Sets given states to example data for tour
 */
export const tourInit = ({ setTouring, setWebsites, setLabels }) => {
  setTouring(true)
  setWebsites(exData.labelArrayPerSite)
  setLabels(exData.dataJson)
  ReactTooltip.rebuild()
}

/**
 * Initializes Home-View states. Makes call to the data base to populate data
 */
export const homeInit = ({ setWebsites, setLabels, setModal, setTouring }) => {
  getTourStatus().then((res) => {
    if (res) {
      tourInit({
        setTouring,
        setLabels,
        setModal,
        setWebsites,
      })
    } else {
      setTouring(false)
      getWebsites().then((websites) => {
        setWebsites(websites)
        getLabels().then((labels) => {
          setLabels(labels)
          ReactTooltip.rebuild()
        })
      })
    }
  })
  document
    .getElementById("detail-modal")
    .addEventListener("hidden.bs.modal", () => {
      setModal({ show: false })
    })
}

/**
 * Initializes Search-View states. If location.state is not undefined, it
 * grabs data from previous page else it calls to the database
 */
export const searchInit = ({
  setTouring,
  setWebsites,
  setFilteredWebsites,
  setFilteredLabels,
  setLabels,
  location,
}) => {
  ReactTooltip.hide()
  getTourStatus().then((res) => {
    if (res) {
      setTouring(true)
      setWebsites(exData.labelArrayPerSite)
      setFilteredWebsites(exData.labelArrayPerSite)
      setFilteredLabels(exData.dataJson)
      setLabels(exData.dataJson)
      ReactTooltip.rebuild()
    } else {
      setTouring(false)
      // if we're not passed the getWebsites call from previous:
      if (location.state === undefined) {
        getWebsites().then((websites) => {
          setWebsites(websites)
          setFilteredWebsites(websites)
          getLabels().then((labels) => {
            setFilteredLabels(labels)
            setLabels(labels)
            ReactTooltip.rebuild()
          })
        })
      } else {
        if (location.state.labeltype === undefined) {
          setWebsites(location.state.websites)
          setFilteredWebsites(location.state.websites)
          setLabels(location.state.labels)
          setFilteredLabels(location.state.labels)
        }
        else {
          // case where we are passed a filter
          setWebsites(location.state.websites)
          setLabels(location.state.labels)
          const filteredLabels = filterLabelObject( location.state.labels, getPermMapping(location.state.labeltype) )

          // remove websites without labels after filter
          var filteredWebsites = {}
          for (const [perm, siteObject] of Object.entries(filteredLabels)) {
            for (const site of Object.keys(siteObject)){
              filteredWebsites[site] = location.state.websites[site]
            }
          }
          // set values
          setFilteredLabels(filteredLabels)
          setFilteredWebsites(filteredWebsites)
        }
      } 
    }
  })
}
