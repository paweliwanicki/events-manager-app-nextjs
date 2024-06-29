import NavBar from "../../components/NavBar/NavBar";
import SnackBar from "../../components/common/SnackBar/SnackBar";
import classes from "./Layout.module.scss";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div id="layout-container" className={`${classes.layout} `}>
      <SnackBar />
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
