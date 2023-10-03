import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { Container, Table, Button, Image, Space, Select } from "@mantine/core";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { useCookies } from "react-cookie";
import { fetchOrders, deleteOrder, updateOrder } from "../api/order";

export default function Orders() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { isLoading, data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(currentUser ? currentUser.token : ""),
  });

  const queryClient = useQueryClient();

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Order Edited",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Order deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Container size="100%">
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        <Table>
          <thead>
            <tr>
              <th>Customer</th>
              <th colSpan={2}>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ? orders.map((o) => {
                  return (
                    <tr key={o._id}>
                      <td>
                        {o.customerName} <br />
                        {o.customerEmail}
                      </td>
                      <td>
                        {o.products.map((product, index) => (
                          <div key={index}>
                            {product.image && product.image !== "" ? (
                              <Image
                                src={"http://localhost:5000/" + product.image}
                                width="40px"
                              />
                            ) : (
                              <Image
                                src={"./images/unavailable-image.jpg"}
                                width="40px"
                              />
                            )}
                          </div>
                        ))}
                      </td>

                      <td>
                        {o.products.map((product, index) => (
                          <div key={index}>
                            <p>{product.title}</p>
                          </div>
                        ))}
                      </td>
                      <td>{o.totalPrice}</td>
                      <td>
                        <Select
                          value={o.status}
                          disabled={
                            o.status == "Pending" || !isAdmin ? true : false
                          }
                          data={[
                            {
                              value: "Pending",
                              label: "Pending",
                              disabled: true,
                            },
                            { value: "Paid", label: "Paid" },
                            { value: "Failed", label: "Failed" },
                            { value: "Shipped", label: "Shipped" },
                            { value: "Delivered", label: "Delivered" },
                          ]}
                          onChange={(newValue) => {
                            updateMutation.mutate({
                              id: o._id,
                              data: JSON.stringify({
                                status: newValue,
                              }),
                              token: currentUser ? currentUser.token : "",
                            });
                          }}
                        />
                      </td>
                      <td>{o.paid_at}</td>
                      <td>
                        {o.status == "Pending" && isAdmin && (
                          <Button
                            variant="outline"
                            color="red"
                            onClick={() => {
                              deleteMutation.mutate(o._id);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
          <Space h="30px" />
          <Button component={Link} to="/">
            Continue Shopping
          </Button>
        </Table>
        <Space h="100px" />
      </Container>
    </>
  );
}
