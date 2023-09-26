import {
  Container,
  Title,
  Table,
  Group,
  Button,
  Image,
  Space,
  TextInput,
  Divider,
  Grid,
  Text,
  Badge,
  Card,
} from "@mantine/core";

import { Link } from "react-router-dom";
import Header from "../Header";

export default function Signup() {
  return (
    <Container>
      <Header title="Signup" page="signup" />
      <Space h="50px" />
      <Card shadow="md" radius="md" withBorder>
        <TextInput label="Name" placeholder="Enter name"></TextInput>
        <Space h="30px" />
        <TextInput label="Email" placeholder="Enter email" />
        <Space h="30px" />
        <TextInput label="Password" placeholder="Enter password" />
        <Space h="30px" />
        <TextInput
          label="Confirm password"
          placeholder="Enter confirmed password"
        />
        <Space h="30px" />
        <Group position="center">
          <Button fullWidth>Signup</Button>
        </Group>
      </Card>
    </Container>
  );
}
