import '@/styles/globals.css';
import type { AppProps } from 'next/app';

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }
import { RouterProvider } from 'react-router-dom';
import { useRouter } from '../hooks/useRouter';
import { UserProvider } from '../components/providers/UserProvider';
import SnackBarProvider from '../components//providers/SnackBarProvider';
import { EventsProvider } from '../components//providers/EventsProvider';
import { CookiesProvider } from 'react-cookie';

function App({ Component, pageProps }: AppProps) {
  //const { router } = useRouter();
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      {/* <UserProvider> */}
      {/* <EventsProvider> */}
      <SnackBarProvider>
        {/* <RouterProvider router={router} /> */}
        <Component {...pageProps} />
      </SnackBarProvider>
      {/* </EventsProvider>
      </UserProvider> */}
    </CookiesProvider>
  );
}

export default App;
