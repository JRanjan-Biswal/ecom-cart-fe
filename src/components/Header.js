"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, Button, Stack, IconButton, Badge, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Popover, MenuItem, MenuList, Paper } from "@mui/material";
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
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileNavigation = (path) => {
    router.push(path);
    handleProfileClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    handleProfileClose();
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
            <IconButton 
              onClick={handleProfileClick}
              sx={{ 
                cursor: "pointer", 
                "&:hover": { opacity: 0.8 },
                p: 0.5
              }}
            >
              <Avatar sx={{ bgcolor: "#00a278", width: 40, height: 40 }}>
                {user ? user.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </IconButton>
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
            
            {isAuthenticated ? (
              <>
                {/* User Info in Mobile Menu */}
                <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#00a278" }}>
                    {user ? user.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      My Account
                    </Typography>
                  </Box>
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
              </>
            ) : (
              /* Non-authenticated menu */
              <List>
                
                {/* When on login/register pages - show the alternate option */}
                {!isAuthenticated && (
                  <>
                    <ListItem button onClick={() => { handleNavigation("/"); setMobileMenuOpen(false); }}>
                      <ListItemIcon>
                        <ArrowBackIcon />
                      </ListItemIcon>
                      <ListItemText primary="Back to Home" />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => { handleNavigation("/register"); setMobileMenuOpen(false); }}>
                      <ListItemIcon>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Create Account" secondary="New to EComCart?" />
                    </ListItem>
                    <ListItem button onClick={() => { handleNavigation("/login"); setMobileMenuOpen(false); }}>
                      <ListItemIcon>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Sign In" secondary="Already have an account?" />
                    </ListItem>
                  </>
                )}
              </List>
            )}
          </Box>
        </Drawer>
      </>

      {/* Profile Popover */}
      <Popover
        open={Boolean(profileAnchorEl)}
        anchorEl={profileAnchorEl}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            animation: 'slideDown 0.2s ease-out',
          }
        }}
      >
        <MenuList disablePadding>
          <MenuItem disabled sx={{ pt: 1.5, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <Avatar sx={{ bgcolor: "#00a278", width: 32, height: 32 }}>
                {user ? user.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {user}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  My Account
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleProfileNavigation("/profile")}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
};

export default Header;
