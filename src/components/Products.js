"use client";

import { Search } from "@mui/icons-material";
import { CircularProgress, Grid, InputAdornment, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../config";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { setCartItems, setProducts } from "../store/slices/cartSlice";
import { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.cart.products);

  const [data, setData] = useState({
    data: [],
    items: [],
  });
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    performAPICall();
    initializeCart();
  }, []);

  const initializeCart = async () => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      if (token) {
        await fetchCart(token);
      }
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (token) {
        fetchCart(token);
      }
    }
  }, [products]);

  const performAPICall = async () => {
    setLoad(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setData((val) => ({ ...val, data: response.data }));
      dispatch(setProducts(response.data));
      setSuccess(true);
      setLoad(false);
    } catch (error) {
      enqueueSnackbar(error.response.statusText, { variant: "warning" });
      setLoad(false);
    }
  };

  const performSearch = async (text) => {
    const searchProduct = text.target.value;
    try {
      const response = await axios(`${config.endpoint}/products/search?value=${searchProduct}`);
      setData((val) => ({ ...val, data: response.data }));
      setSuccess(true);
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.statusText, { variant: "warning" });
      }
      setSuccess(false);
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      // Use all products from Redux state, or fallback to local data
      const allProducts = products.length > 0 ? products : data.data;
      const cartItems = generateCartItemsFrom(response.data, allProducts);
      if (cartItems) {
        dispatch(setCartItems(cartItems));
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
    }
  };

  const handleCart = (productid) => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please login to add items to cart", { variant: "warning" });
      return;
    }
    
    const product = data.data.find(p => p._id === productid);
    if (product) {
      // Check if product is already in cart
      const existingCartItem = cartItems.find(item => item.productId === productid);
      if (existingCartItem) {
        // If already in cart, increase quantity by 1
        addToCartMain(productid, existingCartItem.qty + 1);
      } else {
        // Add new item to cart
        addToCartMain(productid, 1);
      }
    }
  };

  const addToCartMain = async (productId, qty) => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please login to add items to cart", { variant: "warning" });
      return;
    }
    
    try {
      if (typeof window === "undefined") return;
      const token = window.localStorage.getItem("token");
      if (!token) {
        enqueueSnackbar("Please login to add items to cart", { variant: "warning" });
        return;
      }

      const product = data.data.find(p => p._id === productId);
      
      const response = await axios.post(`${config.endpoint}/cart`, {
        "productId": productId,
        "qty": qty,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      const cartItems = generateCartItemsFrom(response.data, data.data);
      dispatch(setCartItems(cartItems || []));
      
      // Show success toast
      const existingCartItem = cartItems.find(item => item.productId === productId);
      if (existingCartItem && existingCartItem.qty === qty) {
        enqueueSnackbar("Item already in cart! Quantity updated", { variant: "info" });
      } else {
        enqueueSnackbar(`${product?.name || "Item"} added to cart!`, { variant: "success" });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data.message?.includes("already")) {
          enqueueSnackbar("Item already in cart! Please update quantity from cart.", { variant: "info" });
        } else {
          enqueueSnackbar(error.response.data.message || "Failed to add to cart", { variant: "error" });
        }
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    if (delay !== 0) {
      clearTimeout(delay);
    }
    const timer = setTimeout(() => performSearch(event), debounceTimeout);
    setDelay(timer);
  };

  return (
    <div>
      <Header>
        <Box>
          <TextField
            className="search-desktop"
            size="small"
            sx={{ width: "45vw" }}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => debounceSearch(e, 500)}
            placeholder="Search for items/categories"
            name="search"
          />
        </Box>
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={(e) => debounceSearch(e, 500)}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container mb={2}>
        <Grid item xs={12}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>

          {load && (
            <Grid container direction="column" justifyContent="center" alignItems="center" className="loading">
              <Grid item>
                <CircularProgress size={40} color="success" />
              </Grid>
              <Grid item>
                <div>Loading Products...</div>
              </Grid>
            </Grid>
          )}

          {!load && !success && (
            <Grid container direction="column" justifyContent="center" alignItems="center" className="loading">
              <Grid item>
                <div>No Products Found</div>
              </Grid>
            </Grid>
          )}

          <Grid item ml={1} my={2}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
              {success && data.data.map((item) => (
                <Grid item xs={6} sm={6} md={3} key={item._id}>
                  <ProductCard product={item} handleAddToCart={(selectedItem) => handleCart(selectedItem._id)} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
