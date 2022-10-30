import {
  Anchor,
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios, { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import BottomError from "../../components/auth/BottomError";
import { Errors } from "../../lib/types";

interface RegisterValues {
  username: string;
  email: string;
  password: string;
}

const isEmail = (str: string) => /^\S+@\S+$/.test(str);

export default function Register() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors<"emailExists" | "usernameExists">>(
    {
      emailExists: null,
      usernameExists: null,
    }
  );

  const form = useForm<RegisterValues>({
    validate: {
      email: (value: string) => (isEmail(value) ? null : "Not an email"),
      username: (value: string) => (value === "" ? "Required*" : null),
      password: (value: string) =>
        value === ""
          ? "Required*"
          : value.length < 6
          ? "Password must be at least 6 characters"
          : null,
    },
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/auth/register",
        values
      );

      const { token } = res.data.data;
      router.push(`/api/auth/cookie?token=${token}`);
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const error = err.response.data.data.errors;

        if (error === "User already exists by username") {
          setErrors(() => ({
            usernameExists: "Username taken",
            emailExists: null,
          }));
        } else if (error === "User already exists by email") {
          setErrors(() => ({
            usernameExists: null,
            emailExists: "Email used by another account",
          }));
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>Register | Hurtle</title>
      </Head>
      <Box mx="auto">
        <Stack>
          <Text size="xl" weight="600">
            Register
          </Text>
          <form onSubmit={form.onSubmit(onSubmit)}>
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
                  <Text>Register with Google</Text>
                </Group>
              </Button>
              <TextInput
                withAsterisk
                label="Email"
                placeholder=""
                {...form.getInputProps("email")}
              />
              <TextInput
                withAsterisk
                label="Username"
                placeholder=""
                {...form.getInputProps("username")}
              />
              <TextInput
                withAsterisk
                label="Password"
                type="password"
                {...form.getInputProps("password")}
              />
            </Stack>
            <Group mt="md">
              <Button type="submit">Submit</Button>
              <Anchor component={Link} href="/auth/login">
                {"Already have an account? Login"}
              </Anchor>
            </Group>
            {errors.emailExists && <BottomError message={errors.emailExists} />}
            {errors.usernameExists && (
              <BottomError message={errors.usernameExists} />
            )}
          </form>
        </Stack>
      </Box>
    </>
  );
}
