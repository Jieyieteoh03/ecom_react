import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCartItems,
  removeItemFromCart,
  removeItemsFromCart,
} from "../api/cart";
import {
  Table,
  Container,
  Button,
  Image,
  Title,
  Space,
  Checkbox,
  Group,
} from "@mantine/core";
import Header from "../Header";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";

export default function Cart() {
  const [checkedList, setCheckedList] = useState([]);
  const queryClient = useQueryClient();
  const [checkAll, setCheckAll] = useState(false);
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  // const calculateTotal = () => {
  //   let total = 0;
  //   cart.map((item) => (total = total + item.quantity * item.price));
  //   return total;
  // };

  const cartTotal = useMemo(() => {
    let total = 0;
    cart.map((item) => (total = total + item.quantity * item.price));
    return total;
  }, [cart]);

  const ths = (
    <tr>
      <th>
        <Checkbox
          type="checkbox"
          checked={checkAll}
          disabled={cart && cart.length > 0 ? false : true}
          onChange={(event) => {
            checkBoxAll(event);
          }}
        />
      </th>
      <th>Product</th>
      <th></th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Total</th>
      <th>Action</th>
    </tr>
  );

  const rows = cart.map((carts) => (
    <tr key={carts.name}>
      <td>
        {" "}
        <Checkbox
          checked={
            checkedList && checkedList.includes(carts._id) ? true : false
          }
          type="checkbox"
          onChange={(event) => {
            checkboxOne(event, carts._id);
          }}
        />
      </td>
      <td>
        {carts.image && carts.image !== "" ? (
          <Image src={"http://localhost:5000/" + carts.image} width="70px" />
        ) : (
          <Image src={"./images/unavailable-image.jpg"} width="70px" />
        )}
      </td>
      <td> {carts.title}</td>
      <td>{carts.price}</td>
      <td>{carts.quantity}</td>
      <td>{carts.price * carts.quantity}</td>
      <td>
        <Button
          color="red"
          variant="outline"
          onClick={() => {
            deleteMutation.mutate(carts._id);
          }}
        >
          Remove
        </Button>
      </td>
    </tr>
  ));

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      const newCheckedList = [];
      cart.forEach((cart) => {
        newCheckedList.push(cart._id);
      });
      setCheckedList(newCheckedList);
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
  };
  const checkboxOne = (event, id) => {
    if (event.target.checked) {
      const newCheckedList = [...checkedList];
      newCheckedList.push(id);
      setCheckedList(newCheckedList);
    } else {
      const newCheckedList = checkedList.filter((cart) => cart !== id);
      setCheckedList(newCheckedList);
      if (newCheckedList.length === 0) {
        setCheckAll(false);
      }
    }
  };

  const deleteMutation = useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Cart deleted",
        color: "red",
      });
    },
  });

  // const deleteCheckedItems = () => {
  //   const newCart = cart.filter((item) => !checkedList.includes(item._id));

  //   queryClient.setQueryData(["cart"], newCart);

  //   setCheckedList([]);
  //   localStorage.setItem("cart", JSON.stringify(newCart));

  //   setCheckAll(false);
  //   setCheckedList([]);
  // };

  const deleteProductsMutation = useMutation({
    mutationFn: removeItemsFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Cart deleted",
        color: "red",
      });
    },
  });

  const deleteCheckedItems = () => {
    deleteProductsMutation.mutate(checkedList);
  };

  return (
    <>
      <Container>
        <Space h="30px" />
        <Header title="Cart" page="cart" />
        <Space h="30px" />
        <Title align="center">Cart</Title>
        <Space h="30px" />
        <Table fontSize="md">
          <thead>{ths}</thead>
          <tbody>
            {rows}
            <tr>
              <td colSpan={5} className="text-end me-5"></td>
              <td>
                <strong>${cartTotal}</strong>
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
        <Space h="30px" />
        <Group position="apart">
          {checkAll || checkedList.length > 0 ? (
            <Button
              onClick={(event) => {
                event.preventDefault();
                deleteCheckedItems();
              }}
              color="red"
            >
              Delete Selected
            </Button>
          ) : (
            <Button disabled>Delete Selected</Button>
          )}

          <Button
            component={Link}
            to="/checkout"
            disabled={cart.length > 0 ? false : true}
          >
            Checkout
          </Button>
        </Group>
      </Container>
    </>
  );
}
