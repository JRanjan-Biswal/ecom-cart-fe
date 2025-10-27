"use client";

import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { config } from "../config";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../store/slices/authSlice";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: "",
    password: "",
    load: false,
  });

  const handleName = (e) => {
    setForm((form) => ({
      ...form,
      username: e.target.value,
    }));
  };

  const handlePassword = (e) => {
    setForm((form) => ({
      ...form,
      password: e.target.value,
    }));
  };

  const login = async (formData) => {
    try {
      if (validateInput(formData)) {
        setForm((form) => ({ ...form, load: true }));

        const response = await axios.post(`${config.endpoint}/auth/login`, {
          username: formData.username,
          password: formData.password
        });
        
        const { token, username, balance } = response.data;
        setForm((form) => ({ ...form, load: false }));
        
        // Use Redux to store auth state
        dispatch(loginSuccess({ token, username, balance }));
        
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        router.push("/");
      }
    } catch (error) {
      setForm((form) => ({ ...form, load: false }));
      dispatch(loginFailure());
      if (error.response && error.response.status >= 400) {
        const messageFromBackend = error.response.data.message;
        enqueueSnackbar(messageFromBackend, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running.", { variant: "warning" });
      }
    }
  };

  const validateInput = (data) => {
    if (data["username"] === "") {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    } else if (data["password"] === "") {
      enqueueSnackbar("Password is required", { variant: "warning" });
      return false;
    }
    return true;
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            name="username"
            label="username"
            placeholder="Enter Username"
            variant="outlined"
            onChange={handleName}
            fullWidth
          />

          <TextField
            id="password"
            name="password"
            type="password"
            label="password"
            placeholder="Enter Password"
            variant="outlined"
            onChange={handlePassword}
            fullWidth
          />
          {form.load ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={() => login(form)}>
              LOGIN TO ECOM和CART
            </Button>
          )}

          <p className="secondary-action">
            Don't have an account?{" "}
            <Link href="/register" className="link">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
