import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProduct, updateProduct, uploadProductImage } from "../api/products";
import { useCookies } from "react-cookie";
// const getProducts = async (id) => {
//   const response = await axios.get("http://localhost:5000/products/" + id);
//   return response.data;
// };

// const updateProduct = async ({ id, data }) => {
//   const response = await axios({
//     method: "PUT",
//     url: "http://localhost:5000/products/" + id,
//     headers: { "Content-Type": "application/json" },
//     data: data,
//   });
//   return response.data;
// };

function ProductsEdit() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState("");
  const { isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    onSuccess: (data) => {
      setTitle(data.title);
      setDesc(data.desc);
      setPrice(data.price);
      setCategory(data.category);
      setImage(data.image);
    },
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

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
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data) => {
      setImage(data.image_url);
      setUploading(false);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleImageUpload = (files) => {
    uploadMutation.mutate(files[0]);
    setUploading(true);
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
        {image && image !== "" ? (
          <>
            <Image src={"http://localhost:5000/" + image} width="100%" />
            <Button color="dark" mt="15 px" onClick={() => setImage("")}>
              Remove Image
            </Button>
          </>
        ) : (
          <Dropzone
            multiple={false}
            accept={IMAGE_MIME_TYPE}
            onDrop={(files) => {
              handleImageUpload(files);
            }}
          >
            <Title order={4} align="center" py="20px">
              Click to upload or Drag image to upload
            </Title>
          </Dropzone>
        )}
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
        {isAdmin && (
          <Button fullWidth onClick={handleUpdateProduct}>
            Update
          </Button>
        )}
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
