import { Container, Title, Space, Divider } from "@mantine/core";
import Products from "../Products";
import Header from "../Header";

export default function Home() {
  return (
    <Container>
      <Header title={"Welcome To My Store"} page="home" />
      <Space h="30px" />
      <Products />
      <Space h="30px" />
    </Container>
  );
}
