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
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userNameInLocalStorage = mounted ? window.localStorage.getItem("username") : null;
  const logIn_NameIsPresent = userNameInLocalStorage ? true : false;
  const token = mounted ? window.localStorage.getItem("token") : null;

  const [data, setData] = useState({
    data: [],
    items: [],
  });
  const [cartLoad, setCartLoad] = useState(false);
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    fetchCart(token);
  }, [cartLoad]);

  const performAPICall = async () => {
    setLoad(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setData((val) => ({ ...val, data: response.data }));
      setSuccess(true);
      setLoad(false);
      setCartLoad(true);
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
      setData((val) => ({ ...val, items: generateCartItemsFrom(response.data, data.data) }));
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not fetch cart details. Check that the backend is running.", { variant: "error" });
      }
      return null;
    }
  };

  const isItemInCart = (items, productId) => {
    if (items === undefined) return false;
    
    let itemAlreadyPresentInCart = false;
    items.map((item) => {
      if (item.productId === productId) {
        itemAlreadyPresentInCart = true;
      }
    });
    return itemAlreadyPresentInCart;
  };

  const handleCart = (productid) => {
    addToCart(token, data.items, data.data, productid, 1);
  };

  const handleQuantity = (itemInCartId, qtyToChange) => {
    addToCartMain(itemInCartId, qtyToChange);
  };

  const addToCart = async (token, items, products, productId, qty) => {
    if (token) {
      if (!isItemInCart(items, productId)) {
        addToCartMain(productId, qty);
      } else {
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity.", { variant: "warning" });
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
    }
  };

  const addToCartMain = async (productId, qty) => {
    try {
      const response = await axios.post(`${config.endpoint}/cart`, {
        "productId": productId,
        "qty": qty,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setData((data) => ({ ...data, items: generateCartItemsFrom(response.data, data.data) }));
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.statusText, { variant: "error" });
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
        <Grid item md={logIn_NameIsPresent ? 9 : 12}>
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

        {logIn_NameIsPresent && (
          <Grid item md={3} xs={12} style={{ backgroundColor: "#E9F5E1" }} mb={2}>
            <Cart products={data.data} items={data.items} handleQuantity={handleQuantity} />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
