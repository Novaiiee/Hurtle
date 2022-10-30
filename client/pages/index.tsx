import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = context.req.cookies.session;

  if (session) {
    return {
      props: {},
      redirect: {
        destination: "/dashboard",
      },
    };
  }

  return {
    props: {},
  };
};

export default function index() {
  return (
    <>
      <Head>
        <title>Hurtle</title>
      </Head>
      <Stack>
        <Paper
          shadow="sm"
          p="xl"
          sx={(theme) => ({
            backgroundColor: theme.colors.blue,
            width: "100%",
          })}
        >
          <Group align="center" position="center">
            <Stack align="center">
              <Title sx={{ color: "white" }}>Hurtle</Title>
              <Text sx={{ color: "white" }}>
                A flashcard application for students
              </Text>
            </Stack>
          </Group>
        </Paper>
      </Stack>
    </>
  );
}
