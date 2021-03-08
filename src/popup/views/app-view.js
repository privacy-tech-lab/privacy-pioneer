import HomeView from "./home-view.js"

const AppView = () => {
  document.getElementById("root").appendChild(HomeView())
}

export default AppView
