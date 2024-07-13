import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../components/providers/UserProvider";
import SnackBarProvider from "../components//providers/SnackBarProvider";
import { EventsProvider } from "../components//providers/EventsProvider";
import Layout from "@/containers/Layout/Layout";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <SnackBarProvider>
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
          <Component {...pageProps} />
          {/* </EventsProvider>
      </UserProvider> */}
        </Layout>
      </SnackBarProvider>
    </SessionProvider>
  );
}

export default App;
