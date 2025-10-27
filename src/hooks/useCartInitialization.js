"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems, setProducts } from "../store/slices/cartSlice";
import { generateCartItemsFrom } from "../components/Cart";
import axios from "axios";
import { config } from "../config";

export const useCartInitialization = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products);

  useEffect(() => {
    const initializeCart = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        
        if (token && products.length > 0) {
          try {
            const response = await axios.get(`${config.endpoint}/cart`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const cartItems = generateCartItemsFrom(response.data, products);
            if (cartItems) {
              dispatch(setCartItems(cartItems));
            }
          } catch (error) {
            console.error("Failed to load cart:", error);
          }
        }
      }
    };

    // Only initialize if we have products loaded
    if (products.length > 0) {
      initializeCart();
    }
  }, [products.length, dispatch]);
};

export default useCartInitialization;

