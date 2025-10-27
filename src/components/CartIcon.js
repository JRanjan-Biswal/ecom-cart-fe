"use client";

import { Badge, Box, Button, Drawer, IconButton, Stack, Typography, Divider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateCartItem, removeFromCart } from "../store/slices/cartSlice";
import axios from "axios";
import { useSnackbar } from "notistack";
import { config } from "../config";

export default function CartIcon() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const handleOpen = () => setDrawerOpen(true);
  const handleClose = () => setDrawerOpen(false);

  const goToCartPage = () => {
    router.push("/cart");
    handleClose();
  };

  const handleQuantityChange = async (productId, newQty, currentQty) => {
    if (newQty <= 0) {
      removeItemFromCart(productId);
    } else {
      updateItemQuantity(productId, newQty);
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) return;

      await axios.delete(`${config.endpoint}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch(removeFromCart(productId));
      enqueueSnackbar("Item removed from cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to remove item", { variant: "error" });
    }
  };

  const updateItemQuantity = async (productId, qty) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) return;

      await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      dispatch(updateCartItem({ productId, qty: qty }));
      enqueueSnackbar("Cart updated", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to update quantity", { variant: "error" });
    }
  };

  const getTotalValue = () => {
    return cartItems.reduce((sum, item) => sum + item.cost * item.qty, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        <Badge badgeContent={getTotalItems()} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Drawer anchor="right" open={drawerOpen} onClose={handleClose}>
        <Box sx={{ width: 400, p: 2 }} role="presentation">
          <Stack spacing={2}>
            <Typography variant="h6" gutterBottom>
              Shopping Cart
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getTotalItems()} item(s) in cart
            </Typography>
            <Divider />
            
            {cartItems.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">Your cart is empty</Typography>
              </Box>
            ) : (
              <>
                {cartItems.map((item) => (
                  <Box key={item.productId} display="flex" gap={2} py={1}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }} 
                    />
                    <Box flex={1}>
                      <Typography variant="body2" noWrap fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{item.cost}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.productId, item.qty - 1, item.qty)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" minWidth={30} textAlign="center">
                          {item.qty}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item.productId, item.qty + 1, item.qty)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{item.cost * item.qty}
                    </Typography>
                  </Box>
                ))}
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">₹{getTotalValue()}</Typography>
                </Box>
              </>
            )}

            <Button variant="contained" fullWidth onClick={goToCartPage} disabled={cartItems.length === 0}>
              View Full Cart
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
