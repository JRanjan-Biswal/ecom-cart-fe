"use client";

import { AddShoppingCartOutlined, Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";
import { useSnackbar } from "notistack";

const ProductCard = ({ product, handleAddToCart }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  const isWishlisted = wishlistItems.some(item => item._id === product._id);

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please login to add items to wishlist", { variant: "warning" });
      return;
    }
    
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      enqueueSnackbar("Removed from wishlist", { variant: "info" });
    } else {
      dispatch(addToWishlist(product));
      enqueueSnackbar("Added to wishlist", { variant: "success" });
    }
  };

  return (
    <Card className="card" sx={{ position: "relative" }}>
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        onClick={handleWishlistToggle}
        color={isWishlisted ? "error" : "default"}
      >
        {isWishlisted ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
      
      <CardMedia component="img" alt={product.name} image={product.image}/>
      
      <CardContent>
        <Typography gutterBottom variant="body" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="body" component="div" color="text.primary">
          ₹{product.cost}
        </Typography>
        <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />
      </CardContent>

      <CardActions>
        <Button 
          size="small" 
          variant="contained" 
          fullWidth 
          className="card-button" 
          startIcon={<AddShoppingCartOutlined />}
          onClick={() => handleAddToCart(product)}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
