import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const addProducts = async (data) => {
  const response = await axios({
    method: "POST",
    url: "http://localhost:5000/products",
    headers: { "Content-Type": "application/json" },
    data: data,
  });
  return response.data;
};

function ProductsAdd() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const createMutation = useMutation({
    mutationFn: addProducts,
    onSuccess: () => {
      notifications.show({
        title: "Item Added",
        color: "green",
      });

      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewProduct = async (event) => {
    event.preventDefault();
    createMutation.mutate(
      JSON.stringify({
        title: title,
        desc: desc,
        price: price,
        category: category,
      })
    );
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Add New Product
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={title}
          placeholder="Enter the product title here"
          label="Title"
          description="The title of the product"
          withAsterisk
          onChange={(event) => setTitle(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={desc}
          placeholder="Enter the product description here"
          label="Description"
          description="The description of the product"
          withAsterisk
          onChange={(event) => setDesc(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={price}
          placeholder="Enter the price here"
          label="Price"
          description="The price of the product"
          withAsterisk
          onChange={(event) => setPrice(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={category}
          placeholder="Enter the category here"
          label="Category"
          description="The category of the product"
          withAsterisk
          onChange={(event) => setCategory(event.target.value)}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewProduct}>
          Add New Product
        </Button>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}

export default ProductsAdd;
