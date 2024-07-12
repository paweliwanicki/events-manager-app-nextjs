import classes from './NavBar.module.scss';
import ContextMenu, {
  ContextMenuOption,
} from '../common/ContextMenu/ContextMenu';
import { useSignForm } from '../../hooks/useSignForm';
import { useUser } from '../../contexts/userContext';
import logo from '../../assets/logo.png';
import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {
  const { user } = useUser();
  const { handleSignOut } = useSignForm();
  //const navigate = useNavigate();

  const USER_MENU_OPTIONS: ContextMenuOption[] = useMemo(
    () => [
      {
        label: <Link href="/friends">Friends</Link>,
      },
      {
        label: 'Sign out',
        action: () => handleSignOut(),
      },
    ],
    [handleSignOut]
  );

  return (
    <nav className={classes.navBar}>
      <div className={classes.content}>
        <Link href="/" title="Home">
          <Image src={logo} alt="events manager" className={classes.logo} />
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
