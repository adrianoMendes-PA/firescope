// eslint-disable-next-line no-unused-vars
import React from "react";
import Drawer from "./components/drawer";
// import Footer from "./components/footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Drawer />
      <Outlet />
      {/*<Footer />*/}
    </>
  )
}

export default App;