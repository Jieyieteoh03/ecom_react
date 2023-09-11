import { Title, Grid, Card, Badge, Group, Space, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const fetchProducts = async (category = "") => {
  const response = await axios.get(
    "http://localhost:5000/products?" +
      (category !== "" ? "category=" + category : "")
  );
  return response.data;
};

const deleteProduct = async (product_id = "") => {
  const response = await axios({
    method: "DELETE",
    url: "http://localhost:5000/products/" + product_id,
  });
};

function Products() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const { data: products } = useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProducts(category),
  });

  const memoryProducts = queryClient.getQueryData(["products", ""]);
  const categoryOptions = useMemo(() => {
    let options = [];

    if (memoryProducts && memoryProducts.length > 0) {
      memoryProducts.forEach((product) => {
        if (!options.includes(product.category)) {
          options.push(product.category);
        }
      });
    }
    return options;
  }, [memoryProducts]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", category],
      });
      notifications.show({
        title: "Product deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Group position="apart">
        <Title order={3} align="center">
          Products
        </Title>
        <Button component={Link} to="/products_add" color="green">
          Add new
        </Button>
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
          }}
        >
          <option value="">All category</option>
          {categoryOptions.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </Group>
      <Space h="30px" />
      <Grid>
        {products
          ? products.map((product) => {
              return (
                <Grid.Col key={product._id} span={4}>
                  <Card withBorder shadow="sm" p="20px">
                    <Title order={5}>{product.title}</Title>
                    <Space h="20px" />
                    <Group position="apart">
                      <Badge color="green">{product.price}</Badge>
                      <Badge color="yellow">{product.category}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Button fullWidth color="blue" size="xs">
                      Add to cart
                    </Button>
                    <Space h="20px" />
                    <Group position="apart">
                      <Button
                        component={Link}
                        to={"/products_edit/" + product._id}
                        color="blue"
                        size="xs"
                        radius="50px"
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          deleteMutation.mutate(product._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}

export default Products;
