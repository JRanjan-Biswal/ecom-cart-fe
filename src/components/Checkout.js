import { CreditCard, Delete } from "@mui/icons-material";
import { Button, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "../config";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

const AddNewAddressView = ({ token, newAddress, handleNewAddress, addAddress }) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        onChange={(e) => handleNewAddress({ ...newAddress, value: e.target.value })}
      />
      <Stack direction="row" my="1rem">
        <Button variant="contained" onClick={() => addAddress(token, newAddress)}>
          Add
        </Button>
        <Button variant="text" onClick={() => handleNewAddress({ ...newAddress, isAddingNewAddress: false })}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState(null);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({ isAddingNewAddress: false, value: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedBalance = localStorage.getItem("balance");
      setToken(storedToken);
      setBalance(storedBalance);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const onLoad = async () => {
        await getAddresses(token);
      };
      onLoad();
    }
  }, [token]);

  if (!token) {
    enqueueSnackbar("You must be logged in to access checkout page", { variant: "info" });
    router.push("/login");
    return null;
  }

  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar("Could not fetch products. Check that the backend is running.", { variant: "error" });
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch {
      enqueueSnackbar("Could not fetch cart details. Check that the backend is running.", { variant: "error" });
      return null;
    }
  };

  const getAddresses = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses({ ...addresses, all: response.data });
      return response.data;
    } catch {
      enqueueSnackbar("Could not fetch addresses. Check that the backend is running.", { variant: "error" });
      return null;
    }
  };

  const addAddress = async (token, newAddress) => {
    try {
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddress.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAddresses({ ...addresses, all: response.data });
      setNewAddress({ isAddingNewAddress: false, value: "" });
      enqueueSnackbar("New Address added Successfully", { variant: "success" });
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not add this address. Check that the backend is running.", { variant: "error" });
      }
    }
  };

  const deleteAddress = async (token, addressId) => {
    try {
      const response = await axios.delete(`${config.endpoint}/user/addresses/${addressId}`, {
        headers: {
          Accept: "application/json, text/plain, /",
          Authorization: `Bearer ${token}`,
        },
      });
      enqueueSnackbar("Deleted", { variant: "success" });
      setAddresses({ ...addresses, all: response.data });
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not delete this address. Check that the backend is running.", { variant: "error" });
      }
    }
  };

  const validateRequest = (items, addresses) => {
    const currentBalance = parseInt(balance) || 0;
    const bal = getTotalCartValue(items);
    if (currentBalance === 0 || bal > currentBalance) {
      enqueueSnackbar("You do not have enough balance in your wallet", { variant: "warning" });
      return false;
    }
    if (addresses.all.length === 0) {
      enqueueSnackbar("Please add a new address before proceeding.", { variant: "warning" });
      return false;
    }
    if (!addresses.selected) {
      enqueueSnackbar("Please select one shipping address to proceed.", { variant: "warning" });
      return false;
    }
    return true;
  };

  const performCheckout = async (token, items, addresses) => {
    const flag = validateRequest(items, addresses);
    if (flag) {
      try {
        await axios.post(
          `${config.endpoint}/cart/checkout`,
          { addressId: addresses.selected },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          }
        );
        enqueueSnackbar("Checkout Successful", { variant: "success" });
        router.push("/thanks");
        return true;
      } catch (e) {
        enqueueSnackbar("Checkout failed. Please try again.", { variant: "error" });
      }
    }
    return false;
  };

  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();
      const cartData = await fetchCart(token);
      if (productsData && cartData) {
        const cartDetails = generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
  }, []);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {addresses.all.length === 0 && (
                <Typography my="1rem">
                  No addresses found for this account. Please add one to proceed
                </Typography>
              )}
              {addresses.all.map((address) => (
                <Box key={address._id} my="1rem">
                  <Typography
                    variant="body2"
                    className={addresses.selected === address._id ? "selected address-item" : "not-selected address-item"}
                    onClick={() => setAddresses({ ...addresses, selected: address._id })}
                    gutterBottom
                  >
                    {address.address}
                    <Button variant="text" size="small" startIcon={<Delete />} onClick={() => deleteAddress(token, address._id)}>
                      Delete
                    </Button>
                  </Typography>
                </Box>
              ))}
            </Box>

            {!newAddress.isAddingNewAddress && (
              <Button color="primary" variant="contained" id="add-new-btn" size="large"
                onClick={() => setNewAddress({ ...newAddress, isAddingNewAddress: true })}>
                Add new address
              </Button>
            )}

            {newAddress.isAddingNewAddress && (
              <AddNewAddressView token={token} newAddress={newAddress} handleNewAddress={setNewAddress} addAddress={addAddress} />
            )}

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">Payment Method</Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>Pay ${getTotalCartValue(items)} of available ${balance || 0}</Typography>
            </Box>

            <Button startIcon={<CreditCard />} variant="contained"
              onClick={async () => await performCheckout(token, items, addresses)}>
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
