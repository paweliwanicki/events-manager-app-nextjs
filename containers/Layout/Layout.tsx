import NavBar from '../../components/NavBar/NavBar';
import SnackBar from '../../components/common/SnackBar/SnackBar';
import classes from './Layout.module.scss';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div id="layout-container" className={`${classes.layout} `}>
      <SnackBar />
      <NavBar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
