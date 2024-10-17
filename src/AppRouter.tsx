import { PrivateRoute } from 'views/components/PrivateRoute';
import { Signin } from 'views/pages/Signin.tsx';
import { createBrowserRouter } from 'react-router-dom';
import { MainPanel } from 'views/layouts/MainPanel';
import { ErrorPage } from 'views/pages/ErrorPage';
import { Home } from 'views/pages/Home';
import { SelectCoin } from 'views/pages/SelectCoin';
import { SecondHome } from 'views/pages/SecondHome';
import { SelectMoney } from 'views/pages/SelectMoney';
import { RankPage } from 'views/pages/RankPage';

const AppRouter = createBrowserRouter([
  {
    path: '/signin',
    element: <Signin />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/rank',
    element: <RankPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainPanel />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/second-home',
        element: <SecondHome />,
      },
      {
        path: '/select-coin',
        element: <SelectCoin />,
      },
      {
        path: '/select-money',
        element: <SelectMoney />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export { AppRouter };
