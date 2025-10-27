import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useRouter } from "next/navigation";
import "./Cart.css";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData.length || !productsData.length) {
    return;
  }
  const cartItems = [];
  cartData.forEach((data) => {
    const product = productsData.filter((product) => product._id === data.productId);
    const details = { ...data, ...product[0] };
    cartItems.push(details);
  });
  return cartItems;
};

export const getTotalCartValue = (items = []) => {
  let total = 0;
  if (items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      total += items[i].cost * items[i].qty;
    }
  }
  return total;
};

const GetTotalItems = (items = [], readOnly) => {
  let ShippingCharge = 0;
  let subTotal = getTotalCartValue(items.items);
  let total = ShippingCharge + subTotal;

  return (
    <>
      {readOnly && (
        <Box padding="1rem">
          <h3>Order Details</h3>
          <Stack direction="column" alignItems="center">
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <Box paddingBottom="1rem">Products</Box>
              <Box paddingBottom="1rem">{items.items.length}</Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <Box paddingBottom="1rem">Sub Total</Box>
              <Box paddingBottom="1rem">{subTotal}</Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <Box paddingBottom="1rem">Shipping Charges</Box>
              <Box paddingBottom="1rem">{ShippingCharge}</Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <Box paddingBottom="1rem">
                <h4>Total</h4>
              </Box>
              <Box paddingBottom="1rem">
                <h4>{total}</h4>
              </Box>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
};

const ItemQuantity = ({ value, handleAdd, handleDelete, readOnly }) => {
  return (
    <>
      {!readOnly ? (
        <Stack direction="row" alignItems="center">
          <IconButton size="small" color="primary" onClick={handleDelete}>
            <RemoveOutlined />
          </IconButton>
          <Box padding="0.5rem" data-testid="item-qty">
            {value}
          </Box>
          <IconButton size="small" color="primary" onClick={handleAdd}>
            <AddOutlined />
          </IconButton>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center">
          <Box padding="0.5rem" data-testid="item-qty">
            Qty: {value}
          </Box>
        </Stack>
      )}
    </>
  );
};

const Cart = ({ isReadOnly = false, products, items = [], handleQuantity }) => {
  const router = useRouter();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {items.map((item) => (
          <Box display="flex" alignItems="flex-start" padding="1rem" key={item._id}>
            <Box className="image-container">
              <img src={item.image} alt={item.name} width="100%" height="100%" />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" height="6rem" paddingX="1rem">
              <div>{item.name}</div>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <ItemQuantity
                  value={item.qty}
                  handleAdd={() => handleQuantity(item.productId, Number(item.qty) + 1)}
                  handleDelete={() => handleQuantity(item.productId, Number(item.qty) - 1)}
                  readOnly={isReadOnly}
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box color="#3C3C3C" fontWeight="700" fontSize="1.5rem" alignSelf="center" data-testid="cart-total">
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button color="primary" variant="contained" startIcon={<ShoppingCart />} className="checkout-btn"
              onClick={() => { router.push("/checkout"); }}>
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      <Box className="cart">
        <GetTotalItems items={items} readOnly={isReadOnly} />
      </Box>
    </>
  );
};

export default Cart;
