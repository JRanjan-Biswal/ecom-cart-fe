"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Avatar, Button, Stack, IconButton, Badge } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import "./Header.css";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout, initializeAuth } from "../store/slices/authSlice";
import CartIcon from "./CartIcon";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box className="header-title" onClick={() => router.push("/")}>
        <img src="/logo_light.svg" alt="EcomCart-icon"></img>
      </Box>

      {children}

      {hasHiddenAuthButtons && (
        <Button className="explore-button" startIcon={<ArrowBackIcon />} variant="text" onClick={() => router.push("/")}>
          Back to explore
        </Button>
      )}

      {isAuthenticated && (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <CartIcon />
          <IconButton onClick={() => router.push("/wishlist")} color="inherit">
            <Badge badgeContent={wishlistCount} color="error">
              <FavoriteIcon />
            </Badge>
          </IconButton>
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => router.push("/profile")}>
            <Avatar alt={user} src="/avatar.png" />
            <div>{user}</div>
          </div>
          <Button variant="text" onClick={handleLogout}>
            logout
          </Button>
        </Stack>
      )}

      {!isAuthenticated && !hasHiddenAuthButtons && (
        <Stack direction="row">
          <Button onClick={() => router.push("/login")}>login</Button>
          <Button variant="contained" onClick={() => router.push("/register")}>register</Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
