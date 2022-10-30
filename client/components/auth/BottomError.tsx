import { Paper, Text } from "@mantine/core";
import type { FC } from "react";

interface BottomErrorProps {
  message: string;
}

const BottomError: FC<BottomErrorProps> = ({ message }) => {
  return (
    <Paper
      mt="xl"
      py="xs"
      sx={(theme) => ({
        background: theme.colors.red,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Text sx={{ color: "white"}}>
        <Text span sx={{ fontWeight: 600 }}>ERROR: </Text>
        <Text span>{message}</Text>
      </Text>
    </Paper>
  );
};
export default BottomError;
