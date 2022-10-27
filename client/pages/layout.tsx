import {
  Anchor,
  AppShell,
  Button,
  Container,
  Footer,
  Group,
  Header,
  Stack,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { GitHub } from "react-feather";
export default function Layout({ children }: any) {
  return (
    <AppShell
      padding="xl"
      header={
        <Header height={40} p="xl">
          <Container
            sx={{ display: "flex", height: "100%", alignItems: "center" }}
          >
            <Group position="apart" style={{ width: "100%" }}>
              <>
                <Text weight="600"href="/" component={Link}>Hurtle</Text>
              </>
              <Group>
                <Button variant="light" component={Link} href="/auth/login">
                  Login
                </Button>
                <Button variant="subtle" component={Link} href="/auth/signup">
                  Or Sign Up
                </Button>
              </Group>
            </Group>
          </Container>
        </Header>
      }
      footer={
        <Footer height={60} p="md">
          <Group position="apart">
            <div>
              Hurtle -{" "}
              <Anchor component={Link} href="https://github.com/novaiiee">
                @Novaiiee
              </Anchor>
            </div>
            <div>
              <Anchor
                component={Link}
                href="https://github.com/novaiiee/hurtle"
              >
                <GitHub />
              </Anchor>
            </div>
          </Group>
        </Footer>
      }
    >
      <Container>
        <Stack py="xl">{children}</Stack>
      </Container>
    </AppShell>
  );
}
