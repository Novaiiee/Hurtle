import { ActionIcon, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { FC } from "react";
import { Edit2 } from "react-feather";
interface FlashCardSetProps {
  title: string;
  description: string;
  isPublic: boolean;
  id: string;
}

const FlashCardSet: FC<FlashCardSetProps> = ({
  title,
  description,
  isPublic,
  id,
}) => {
  return (
    <Paper shadow="md" p="md">
      <Stack>
        <Group>
          <Text weight="600">{title}</Text>
          <ActionIcon>
            <Edit2 size={20} />
          </ActionIcon>
          <Button variant="outline">Open Set</Button>
        </Group>
        <Text>{description.substring(0, 175).trim() + "..."}</Text>
      </Stack>
    </Paper>
  );
};
export default FlashCardSet;
