import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../config";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    load: false,
    success: false,
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

  return (
    <>
      {userInfo.success ? router.push("/login") : (
        <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">
          <Header hasHiddenAuthButtons />
          <Box className="content">
            <Stack spacing={2} className="form">
              <h2 className="title">Register</h2>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                title="Username"
                name="username"
                value={userInfo["username"]}
                placeholder="Enter Username"
                onChange={handleUserNameChange}
                fullWidth
              />
              <TextField
                id="password"
                variant="outlined"
                label="Password"
                name="password"
                type="password"
                helperText="Password must be atleast 6 characters length"
                fullWidth
                value={userInfo["password"]}
                onChange={handlePassword}
                placeholder="Enter a password with minimum 6 characters"
              />
              <TextField
                id="confirmPassword"
                variant="outlined"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={userInfo["confirmPassword"]}
                onChange={handleConfirmPassword}
                fullWidth
              />
              {userInfo.load ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <Button className="button" variant="contained" onClick={() => register(userInfo)}>
                  Register Now
                </Button>
              )}

              <p className="secondary-action">
                Already have an account?{" "}
                <Link className="link" href="/login">
                  Login here
                </Link>
              </p>
            </Stack>
          </Box>
          <Footer />
        </Box>
      )}
    </>
  );
};

export default Register;
