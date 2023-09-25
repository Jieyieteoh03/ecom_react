import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
  Select,
} from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { fetchOrders, deleteOrder, updateStatus, getOrder } from "../api/order";

export default function Orders() {
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");

  const { isLoading } = useQuery({
    queryKey: ["orders", orders._id],
    queryFn: () => getOrder(orders._id),
    onSuccess: (data) => {
      setStatus(data.status);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Status Edited",
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

  const handleUpdateStatus = async (order, payment) => {
    updateMutation.mutate({
      id: order._id,
      data: JSON.stringify({
        status: payment,
      }),
    });
  };

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
      <Container>
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
                      <td>{o.customerEmail}</td>
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
                          onChange={(payment) => handleUpdateStatus(o, payment)}
                          w="150px"
                          placeholder={o.status}
                          disabled={o.status == "Pending" ? true : false}
                          data={["Paid", "Failed", "Shipped", "Delivered"]}
                        />
                      </td>
                      <td>{o.paid_at}</td>
                      <td>
                        {o.status == "Pending" && (
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
          <Button component={Link} to="/">
            Continue Shopping
          </Button>
        </Table>
        <Space h="100px" />
      </Container>
    </>
  );
}
