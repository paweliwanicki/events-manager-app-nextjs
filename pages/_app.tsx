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
        <UserProvider>
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
            <EventsProvider>
              <Component {...pageProps} />
            </EventsProvider>
          </Layout>
        </UserProvider>
      </SnackBarProvider>
    </SessionProvider>
  );
}

export default App;
