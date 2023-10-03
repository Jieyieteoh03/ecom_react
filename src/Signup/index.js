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
  PasswordInput,
} from "@mantine/core";

import { Link } from "react-router-dom";
import Header from "../Header";
import { registerUser } from "../api/auth";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cookies, setCookie, removeCookies] = useCookies(["currentUser"]);

  const signupMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      setCookie("currentUser", user);
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    let error = false;
    // make sure email & password are not empty.
    if (!name || !email || !password || !confirmPassword) {
      error = "Please fill out all the required fields.";
    } else {
      notifications.show({
        title: "Welcome!",
        color: "green",
      });
    }
    if (error) {
      // if empty show error message
      notifications.show({
        title: error,
        color: "red",
      });
    } else {
      // make api call
      signupMutation.mutate(
        JSON.stringify({
          name: name,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        })
      );
    }
  };
  return (
    <Container>
      <Header title="Signup" page="signup" />
      <Space h="50px" />
      <Card
        withBorder
        shadow="lg"
        mx="auto"
        sx={{
          maxWidth: "500px",
        }}
      >
        <TextInput
          label="Name"
          placeholder="Enter name"
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="30px" />
        <TextInput
          label="Email"
          placeholder="Enter email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <Space h="30px" />
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <Space h="30px" />
        <PasswordInput
          label="Confirm password"
          placeholder="Enter confirm password"
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <Space h="30px" />
        <Group position="center">
          <Button fullWidth onClick={handleSubmit}>
            Signup
          </Button>
        </Group>
      </Card>
    </Container>
  );
}
