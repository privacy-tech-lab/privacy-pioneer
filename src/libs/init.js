import ReactTooltip from "react-tooltip"
import { getWebsites, getLabels } from "./indexed-db/getIdbData"
import exData from "./tour/exData.json"
import { getTourStatus } from "./indexed-db/settings"

export const tourInit = ({ setTouring, setWebsites, setLabels, setModal }) => {
  setTouring(true)
  setWebsites(exData.labelArrayPerSite)
  setLabels(exData.dataJson)
  ReactTooltip.rebuild()
}

export const labelInit = ({ setWebsites, setLabels }) => {
  getWebsites().then((websites) => {
    setWebsites(websites)
    getLabels().then((labels) => {
      setLabels(labels)
      ReactTooltip.rebuild()
    })
  })
}

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
      labelInit({
        setWebsites,
        setLabels,
        setModal,
      })
    }
  })
  document
    .getElementById("detail-modal")
    .addEventListener("hidden.bs.modal", () => {
      setModal({ show: false })
    })
}

export const searchInit = ({
  setTouring,
  setWebsites,
  setFilteredWebsites,
  setFilteredLabels,
  setLabels,
  websites,
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
      }
      // if we are then allWebsties is already set. setFilteredLabels will be called by filterLabels
      else {
        console.log("HELLO")
        setFilteredWebsites(websites)
        getLabels().then((labels) => {
          setLabels(labels)
          filterLabels(labels)
        })
      }
    }
  })
}
