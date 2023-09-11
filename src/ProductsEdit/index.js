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
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

const getProducts = async (id) => {
  const response = await axios.get("http://localhost:5000/products/" + id);
  return response.data;
};

const updateProduct = async ({ id, data }) => {
  const response = await axios({
    method: "PUT",
    url: "http://localhost:5000/products/" + id,
    headers: { "Content-Type": "application/json" },
    data: data,
  });
  return response.data;
};

function ProductsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const { data } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProducts(id),
    onSuccess: (data) => {
      setTitle(data.title);
      setDesc(data.desc);
      setPrice(data.price);
      setCategory(data.category);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      notifications.show({
        title: "Product Edited",
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

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        title: title,
        desc: desc,
        price: price,
        category: category,
      }),
    });
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Edit product
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
        <Button fullWidth onClick={handleUpdateProduct}>
          Update
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

export default ProductsEdit;
