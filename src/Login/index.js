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
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Header from "../Header";

export default function Login() {
  return (
    <Container>
      <Header title="Login" page="login" />
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput label="Email" placeholder="Enter email" />
        <Space h="30px" />
        <TextInput label="Password" placeholder="Enter password" />
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button fullWidth>Login</Button>
      </Group>
    </Container>
  );
}
