import { Container, Title, Space, Divider } from "@mantine/core";
import Products from "../Products";

export default function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Title align="center">Welcome to My Store</Title>
      <Space h="20px" />
      <Divider />
      <Space h="30px" />
      <Products />
      <Space h="30px" />
    </Container>
  );
}
