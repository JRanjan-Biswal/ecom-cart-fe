"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, Button, Stack, IconButton, Badge, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    router.push("/");
    window.location.reload();
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <Box className="header">
      <Box className="header-title" onClick={() => router.push("/")}>
        <img src="/logo_light.svg" alt="EcomCart-icon"></img>
      </Box>

      {children}

      {/* Desktop Navigation */}
      <Stack direction="row" spacing={1} className="desktop-nav">
        {hasHiddenAuthButtons && (
          <Button className="explore-button" startIcon={<ArrowBackIcon />} variant="text" onClick={() => router.push("/")}>
            Back to explore
          </Button>
        )}

        {isAuthenticated && (
          <>
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
          </>
        )}

        {!isAuthenticated && !hasHiddenAuthButtons && (
          <>
            <Button onClick={() => router.push("/login")}>login</Button>
            <Button variant="contained" onClick={() => router.push("/register")}>register</Button>
          </>
        )}
      </Stack>

      {/* Mobile Hamburger Menu */}
      {isAuthenticated && (
        <>
          <IconButton className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>
          
          <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={handleMobileMenuClose}
            className="mobile-drawer"
          >
            <Box sx={{ width: 280 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                <Box className="header-title" onClick={() => { router.push("/"); handleMobileMenuClose(); }}>
                  <img src="/logo_light.svg" alt="EcomCart-icon"></img>
                </Box>
                <IconButton onClick={handleMobileMenuClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Divider />
              
              <List>
                <ListItem button onClick={() => handleNavigation("/cart")}>
                  <ListItemIcon>
                    <Badge badgeContent={cartCount} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Cart" secondary={`${cartCount} items`} />
                </ListItem>
                
                <ListItem button onClick={() => handleNavigation("/wishlist")}>
                  <ListItemIcon>
                    <Badge badgeContent={wishlistCount} color="error">
                      <FavoriteIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Wishlist" secondary={`${wishlistCount} items`} />
                </ListItem>
                
                <ListItem button onClick={() => handleNavigation("/profile")}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" secondary={user} />
                </ListItem>
                
                <Divider />
                
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default Header;
