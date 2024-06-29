import classes from './NavBar.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import ContextMenu, {
  ContextMenuOption,
} from '../common/ContextMenu/ContextMenu';
import { useSignForm } from '../../hooks/useSignForm';
import { useUser } from '../../contexts/userContext';
import logo from '../../assets/logo.png';
import { useMemo } from 'react';

const NavBar = () => {
  const { user } = useUser();
  const { handleSignOut } = useSignForm();
  const navigate = useNavigate();

  const USER_MENU_OPTIONS: ContextMenuOption[] = useMemo(
    () => [
      {
        label: 'Friends',
        action: () => navigate('/friends'),
      },
      {
        label: 'Sign out',
        action: () => handleSignOut(),
      },
    ],
    [handleSignOut, navigate]
  );

  return (
    <nav className={classes.navBar}>
      <div className={classes.content}>
        <Link to="/" title="Home">
          <img src={logo} alt="company logo" className={classes.logo} />
        </Link>
        <div className={classes.userMenu}>
          {user && (
            <ContextMenu
              classNames={classes.userContextMenu}
              options={USER_MENU_OPTIONS}
              id="user-menu"
              iconId="icon-user"
              width={48}
              height={48}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
