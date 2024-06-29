import Layout from '../containers/Layout/Layout';
import Dashboard from '../containers/Dashboard/Dashboard';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from '../guards/AuthGuard';
import { RoutePath } from '../enums/RoutePath';
import { createBrowserHistory } from 'history';
import LoginContainer from '../containers/LoginContainer/LoginContainer';
import FriendsPanel from '../containers/FriendsPanel/FriendsPanel';

const history = createBrowserHistory();

const router = createBrowserRouter([
  {
    path: RoutePath.HOME,
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to={RoutePath.DASHBOARD} replace /> },
      {
        path: RoutePath.LOGIN,
        element: <LoginContainer />,
      },
      {
        path: RoutePath.DASHBOARD,
        element: (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        ),
      },
      {
        path: RoutePath.FRIENDS,
        element: (
          <AuthGuard>
            <FriendsPanel />
          </AuthGuard>
        ),
      },
    ],
  },
]);

export const useRouter = () => {
  return {
    history,
    router,
  };
};
