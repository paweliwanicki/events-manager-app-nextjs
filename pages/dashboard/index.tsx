import Head from "next/head";
import { getSession } from "next-auth/react";
import { IncomingMessage } from "http";
import Dashboard from "@/containers/Dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Events Dashboard</title>
        <meta
          name="description"
          content="Dashboard with list of available events created by users. You cna browse of public or your friends private events."
        />
      </Head>
      <Dashboard />
    </>
  );
}

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
