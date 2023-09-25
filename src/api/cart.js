//get cart from items
export const getCartItems = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  return cart ? cart : [];
};

//get cart from items
export const clearCartItems = () => {
  localStorage.removeItem("cart");
};

// add product to cart
export const addToCart = (product) => {
  // get all the items from the current cart
  const cart = getCartItems();
  //find if the product already exist in the cart or not
  const existing_product = cart.find((i) => i._id === product._id);
  //if product exist, increase quantity
  if (existing_product) {
    existing_product.quantity++;
    //existing_product.quantity = existing_product.quantity + 1
  } else {
    // add product to cart
    cart.push({
      ...product, // clone the product data
      quantity: 1, // set quantity to 1
    });
  }
  // update cart to localstorrage
  localStorage.setItem("cart", JSON.stringify(cart));
};

// remove product from cart
export const removeItemFromCart = (product) => {
  const cart = getCartItems();

  const newProduct = cart.filter((c) => {
    if (product === c._id) {
      return false;
    }
    return true;
  });

  localStorage.setItem("cart", JSON.stringify(newProduct));
};

// remove multiple products from cart
export const removeItemsFromCart = (list) => {
  const cart = getCartItems();
  const newCart = cart.filter((item) => {
    // if item is inside the list array, then it should be removed
    if (list.includes(item._id)) {
      return false; // return false means it won't in the new cart.
    }
    return true; // return true means it still be in the new cart
  });
  localStorage.setItem("cart", JSON.stringify(newCart));
};
