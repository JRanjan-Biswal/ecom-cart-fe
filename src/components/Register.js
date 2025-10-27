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
import "./Register.css";
import { Visibility, VisibilityOff, Email, Lock, PersonAdd, ShoppingBag } from "@mui/icons-material";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    load: false,
    success: false,
    showPassword: false,
    showConfirmPassword: false,
  });

  const handleUserNameChange = (e) => {
    const name = e.target.value;
    setUserInfo((userInfo) => ({ ...userInfo, username: name }));
  };

  const handlePassword = (e) => {
    const pass = e.target.value;
    setUserInfo((userInfo) => ({ ...userInfo, password: pass }));
  };

  const handleConfirmPassword = (e) => {
    const confPass = e.target.value;
    setUserInfo((userInfo) => ({ ...userInfo, confirmPassword: confPass }));
  };

  const register = async (formData) => {
    if (validateInput(formData)) {
      setUserInfo((userInfo) => ({ ...userInfo, load: true }));
      const dataRequiredForRegister = {
        username: formData["username"],
        password: formData["password"],
      };

      await axios.post(`${config.endpoint}/auth/register`, dataRequiredForRegister)
        .then((res) => {
          setUserInfo((userInfo) => ({ ...userInfo, load: false }));
          enqueueSnackbar("Registered successfully", { variant: "success" });
          setUserInfo((userInfo) => ({ ...userInfo, success: true }));
          setTimeout(() => router.push("/login"), 1000);
        })
        .catch((err) => {
          setUserInfo((userInfo) => ({ ...userInfo, load: false }));
          if (err.response.request) {
            enqueueSnackbar(err.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar("Something went wrong. Check that the backend is running.", { variant: "error" });
          }
        });
    }
  };

  const validateInput = (data) => {
    if (data["username"] === "") {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    } else if (data["username"].length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: "warning" });
      return false;
    } else if (data["password"] === "") {
      enqueueSnackbar("Password is required", { variant: "warning" });
      return false;
    } else if (data["password"].length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "warning" });
      return false;
    } else if (data["password"] !== data["confirmPassword"]) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }
    return true;
  };

  const handleClickShowPassword = () => {
    setUserInfo((userInfo) => ({
      ...userInfo,
      showPassword: !userInfo.showPassword,
    }));
  };

  const handleClickShowConfirmPassword = () => {
    setUserInfo((userInfo) => ({
      ...userInfo,
      showConfirmPassword: !userInfo.showConfirmPassword,
    }));
  };

  return (
    <>
      {userInfo.success ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box className="register-container">
          <Header hasHiddenAuthButtons />
          <Box className="register-hero">
            <div maxWidth="lg" className="register-content">
              {/* Left Side - Welcome Text */}
              <Box className="register-welcome">
                <Typography variant="h2" className="welcome-title">
                  Join EComCart Today
                </Typography>
                <Typography variant="h5" className="welcome-subtitle">
                  Start Your Shopping Journey
                </Typography>
                <Box mt={3}>
                  <Typography className="feature-text">
                    ✓ Exclusive Member Benefits
                  </Typography>
                  <Typography className="feature-text">
                    ✓ Secure Payment Processing
                  </Typography>
                  <Typography className="feature-text">
                    ✓ Fast & Reliable Delivery
                  </Typography>
                </Box>
              </Box>

              {/* Right Side - Register Form */}
              <Box className="register-card">
                <Box className="register-header">
                  <Box className="logo-icon">
                    <PersonAdd sx={{ fontSize: 40, color: "#fff" }} />
                  </Box>
                  <Typography variant="h3" className="register-title">
                    Create Account
                  </Typography>
                  <Typography variant="body2" className="register-subtitle">
                    Join EComCart and enjoy seamless shopping
                  </Typography>
                </Box>

                <Stack spacing={3} className="register-form">
                  <TextField
                    id="username"
                    name="username"
                    label="Username"
                    placeholder="Choose a username (min 6 characters)"
                    variant="outlined"
                    value={userInfo["username"]}
                    onChange={handleUserNameChange}
                    fullWidth
                    className="register-input"
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
                    type={userInfo.showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Enter password (min 6 characters)"
                    variant="outlined"
                    value={userInfo["password"]}
                    onChange={handlePassword}
                    fullWidth
                    className="register-input"
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
                            {userInfo.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type={userInfo.showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    variant="outlined"
                    value={userInfo["confirmPassword"]}
                    onChange={handleConfirmPassword}
                    fullWidth
                    className="register-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "#00a278" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {userInfo.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {userInfo.load ? (
                    <Box display="flex" justifyContent="center" py={2}>
                      <CircularProgress size={40} />
                    </Box>
                  ) : (
                    <Button 
                      className="register-button" 
                      variant="contained" 
                      onClick={() => register(userInfo)}
                      size="large"
                      fullWidth
                    >
                      Create Account
                    </Button>
                  )}

                  <Box className="register-footer">
                    <Typography variant="body2" className="register-footer-text">
                      Already have an account?{" "}
                      <Link href="/login" className="register-link">
                        Login here
                      </Link>
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </div>
          </Box>
          <Footer />
        </Box>
      )}
    </>
  );
};

export default Register;
