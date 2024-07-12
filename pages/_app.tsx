import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { RouterProvider } from 'react-router-dom';
import { useRouter } from '../hooks/useRouter';
import { UserProvider } from '../components/providers/UserProvider';
import SnackBarProvider from '../components//providers/SnackBarProvider';
import { EventsProvider } from '../components//providers/EventsProvider';
import { CookiesProvider } from 'react-cookie';
import Layout from '@/containers/Layout/Layout';
import Head from 'next/head';

function App({ Component, pageProps }: AppProps) {
  //const { router } = useRouter();
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Layout>
        <Head>
          <title>Events Manager App</title>
          <meta
            name="description"
            content="Events manager app written in NextJS"
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        {/* <UserProvider> */}
        {/* <EventsProvider> */}
        <SnackBarProvider>
          {/* <RouterProvider router={router} /> */}
          <Component {...pageProps} />
        </SnackBarProvider>
        {/* </EventsProvider>
      </UserProvider> */}
      </Layout>
    </CookiesProvider>
  );
}

export default App;
