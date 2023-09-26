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
} from "@mantine/core";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../Header";

export default function Signup() {
  return (
    <Container>
      <Header title="Signup" page="signup" />
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
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
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button fullWidth>Signup</Button>
      </Group>
    </Container>
  );
}
