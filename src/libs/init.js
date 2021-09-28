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
  setAllWebsites,
  setFilter,
  setWebLabels,
  setAllLabels,
}) => {
  ReactTooltip.hide()
  getTourStatus().then((res) => {
    if (res) {
      setTouring(true)
      setAllWebsites(exData.labelArrayPerSite)
      setFilter(exData.labelArrayPerSite)
      setWebLabels(exData.dataJson)
      setAllLabels(exData.dataJson)
      ReactTooltip.rebuild()
    } else {
      setTouring(false)
      // if we're not passed the getWebsites call from previous:
      if (location.state === undefined) {
        getWebsites().then((websites) => {
          setAllWebsites(websites)
          setFilter(websites)
          getLabels().then((labels) => {
            setWebLabels(labels)
            setAllLabels(labels)
            ReactTooltip.rebuild()
          })
        })
      }
      // if we are then allWebsties is already set. setWebLabels will be called by filterLabels
      else {
        setFilter(allWebsites)
        getLabels().then((labels) => {
          setAllLabels(labels)
          filterLabels(labels)
        })
      }
    }
  })
}
