import { Title, Space, Divider, Group, Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Title align="center">Welcome to My Store</Title>
      <Space h="20px" />
      <Group position="apart">
        <Button component={Link} to="/" variant="light">
          Home
        </Button>
        <Button component={Link} to="/cart" variant="light">
          Cart
        </Button>
        <Button component={Link} to="" variant="light">
          My orders
        </Button>
      </Group>
      <Space h="20px" />
      <Divider />
    </>
  );
}
