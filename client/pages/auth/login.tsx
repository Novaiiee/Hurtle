import { Box, Button, Group, Space, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import {} from "react-feather";
import * as z from "zod";

const schema = z.object({
  identifier: z.string({ required_error: "Identifier is required" }),
  password: z.string(),
});

export default function Login() {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <Box mx="auto">
      <Stack>
        <Text size="xl" weight="600">
          Login
        </Text>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack spacing="lg">
            <Button
              variant="outline"
            
              component={Link}
              href={process.env.NEXT_PUBLIC_SERVER_URL + "/auth/google"}
            >
              <Group>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                  height={20}
                />

                <Text>Login with Google</Text>
              </Group>
            </Button>
            <TextInput
              withAsterisk
              label="Email or Username"
              placeholder=""
              {...form.getInputProps("identifier")}
            />
            <TextInput
              withAsterisk
              label="Password"
              type="password"
              {...form.getInputProps("password")}
            />
          </Stack>
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Stack>
    </Box>
  );
}
