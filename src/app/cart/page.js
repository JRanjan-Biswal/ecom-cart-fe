"use client";

import { Box, Button, Container, Grid, Typography, IconButton, Paper } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { updateCartItem, removeFromCart, setCartItems, setProducts } from "../../store/slices/cartSlice";
import axios from "axios";
import { useSnackbar } from "notistack";
import { config } from "../../config";
import { generateCartItemsFrom } from "../../components/Cart";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.cart.products);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty <= 0) {
      // Quantity is 0 or less, remove the item
      removeItemFromCart(productId);
    } else {
      // Update quantity
      updateItemQuantity(productId, newQty);
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) {
        enqueueSnackbar("Please login to manage cart", { variant: "warning" });
        return;
      }

      const response = await axios.delete(`${config.endpoint}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update Redux state with updated cart from backend
      if (response.data) {
        if (products.length > 0) {
          const cartItems = generateCartItemsFrom(response.data, products) || [];
          dispatch(setCartItems(cartItems));
        } else {
          // If no products loaded, just use the raw cart data
          dispatch(setCartItems(response.data.map(item => ({
            productId: item.productId,
            qty: item.qty
          }))));
        }
      }
      
      enqueueSnackbar("Item removed from cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Failed to remove item", { variant: "error" });
    }
  };

  const updateItemQuantity = async (productId, qty) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) return;

      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update Redux state with backend response
      if (response.data && products.length > 0) {
        const cartItems = generateCartItemsFrom(response.data, products) || [];
        dispatch(setCartItems(cartItems));
      } else {
        dispatch(updateCartItem({ productId, qty }));
      }
    } catch (error) {
      enqueueSnackbar("Failed to update quantity", { variant: "error" });
    }
  };

  const getTotalValue = () => {
    return cartItems.reduce((sum, item) => sum + item.cost * item.qty, 0);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, minHeight: "70vh" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Add items to your cart to continue shopping
            </Typography>
            <Button variant="contained" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {cartItems.map((item) => (
                <Paper key={item.productId} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" gap={2}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ 
                        width: 120, 
                        height: 120, 
                        objectFit: "cover", 
                        borderRadius: 4 
                      }} 
                    />
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        ₹{item.cost}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2">Quantity:</Typography>
                        <Box display="flex" alignItems="center" border="1px solid" borderRadius={1}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item.productId, item.qty - 1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body2" minWidth={40} textAlign="center">
                            {item.qty}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item.productId, item.qty + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="h6" fontWeight="bold">
                        ₹{item.cost * item.qty}
                      </Typography>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => removeItemFromCart(item.productId)}
                        sx={{ mt: 1 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Items:</Typography>
                  <Typography variant="body2">{cartItems.length}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">₹{getTotalValue()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2">₹0</Typography>
                </Box>
                <Box sx={{ borderTop: "2px solid", pt: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold">₹{getTotalValue()}</Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  onClick={handleCheckout}
                  startIcon={<ShoppingCartIcon />}
                >
                  Proceed to Checkout
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
}
