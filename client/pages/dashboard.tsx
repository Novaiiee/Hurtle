import { Stack, Text } from "@mantine/core";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import cookies from "js-cookie";
import { GetServerSideProps } from "next";
import Head from "next/head";
import FlashCardSet from "../components/flashcards/FlashCardSet";
import { fetchUser, fetchUserSets } from "../lib/query/fetchers";
import { redirectIfNoSession } from "../lib/utils/routeHelpers";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies["session"];

  const { ok, returnValue } = redirectIfNoSession(context);
  if (!ok) return returnValue;

  const queryClient = new QueryClient();
  const user = await fetchUser(token);
  const sets = await fetchUserSets(token);

  await queryClient.prefetchQuery(["user"], () => user);
  await queryClient.prefetchQuery(["user-sets"], () => sets);

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
};

export default function Home() {
  const { data: user } = useQuery(["user"], () => fetchUser(), {
    enabled: cookies.get("session") != undefined,
  });
  const { data: setData } = useQuery(["user-sets"], () => fetchUserSets(), {
    enabled: cookies.get("session") != undefined,
  });

  return (
    <>
      <Head>
        <title>Dashboard | Hurtle</title>
      </Head>
      <>
        <Text weight="600" size="xl">
          Welcome Back {user?.username}
        </Text>
        <Stack py="lg">
          <Text>Your Sets</Text>
          <Stack>
            {setData?.sets.map((set) => (
              <FlashCardSet
                id={set.id}
                key={set.id}
                title={set.title}
                isPublic={set.isPublic}
                description={set.description}
              />
            ))}
          </Stack>
        </Stack>
      </>
    </>
  );
}
