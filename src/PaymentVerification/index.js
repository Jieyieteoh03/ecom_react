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
  Card,
  Loader,
} from "@mantine/core";

import { useSearchParams } from "react-router-dom";
import { verifyPayment } from "../api/payment";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const billplz_id = searchParams.get("billplz[id]");
  const billplz_paid = searchParams.get("billplz[paid]");
  const billplz_paid_at = searchParams.get("billplz[paid_at]");
  const billplz_x_signature = searchParams.get("billplz[x_signature]");

  useEffect(() => {
    verifyPaymentMutation.mutate(
      JSON.stringify({
        billplz_id: billplz_id,
        billplz_paid: billplz_paid,
        billplz_paid_at: billplz_paid_at,
        billplz_x_signature: billplz_x_signature,
      })
    );
  }, []);

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (order) => {
      console.log(order);
      // check if order is paid or not
      if (order.status === "Paid") {
        // if it's paid, show paid message
        notifications.show({
          title: "Payment verified",
          color: "green",
        });
      } else if (order.status === "Failed") {
        // if payment failed, show failed message
        notifications.show({
          title: "Payment failed",
          color: "red",
        });
      }
      // redirect to orders page
      navigate("/orders");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  return (
    <Container>
      <Space h="100px" />
      <Card withBorder shadow="md" px="30px" py="60px">
        <Group position="center">
          <Loader size="60px" />
        </Group>
        <Title order={1} align="center">
          Verifying your payment...
        </Title>
        <Title order={2} align="center">
          Please <Text color="red">DO NOT CLOSE</Text>your browser or press the
          back button
        </Title>
      </Card>
    </Container>
  );
}
