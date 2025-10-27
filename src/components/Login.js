"use client";

import { Button, CircularProgress, Stack, TextField, Typography, InputAdornment, IconButton } from "@mui/material";
import { Box, Container } from "@mui/system";
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
import { Visibility, VisibilityOff, Email, Lock, ShoppingBag } from "@mui/icons-material";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: "",
    password: "",
    load: false,
    showPassword: false,
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

  const handleClickShowPassword = () => {
    setForm((form) => ({
      ...form,
      showPassword: !form.showPassword,
    }));
  };

  return (
    <Box className="login-container">
      <Header hasHiddenAuthButtons />
      <Box className="login-hero">
        <div maxWidth="lg" className="login-content">
          {/* Left Side - Welcome Text */}
          <Box className="login-welcome">
            <Typography variant="h2" className="welcome-title">
              Welcome to EComCart
            </Typography>
            <Typography variant="h5" className="welcome-subtitle">
              Your Ultimate Shopping Destination
            </Typography>
          </Box>

          {/* Right Side - Login Form */}
          <Box className="login-card">
            <Box className="login-header">
              <Box className="logo-icon">
                <ShoppingBag sx={{ fontSize: 40, color: "#fff" }} />
              </Box>
              <Typography variant="h3" className="login-title">
                Welcome Back!
              </Typography>
              <Typography variant="body2" className="login-subtitle">
                Sign in to continue to EComCart
              </Typography>
            </Box>

            <Stack spacing={3} className="login-form">
              <TextField
                id="username"
                name="username"
                label="Username"
                placeholder="Enter your username"
                variant="outlined"
                onChange={handleName}
                fullWidth
                className="login-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#00a278" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                id="password"
                name="password"
                type={form.showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                variant="outlined"
                onChange={handlePassword}
                fullWidth
                className="login-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#00a278" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {form.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {form.load ? (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={40} />
                </Box>
              ) : (
                <Button 
                  className="login-button" 
                  variant="contained" 
                  onClick={() => login(form)}
                  size="large"
                  fullWidth
                >
                  Login to EComCart
                </Button>
              )}

              <Box className="login-footer">
                <Typography variant="body2" className="login-footer-text">
                  Don't have an account?{" "}
                  <Link href="/register" className="login-link">
                    Register now
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </div>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
