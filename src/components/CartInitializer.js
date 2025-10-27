"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems, setProducts } from "../store/slices/cartSlice";
import { generateCartItemsFrom } from "./Cart";
import axios from "axios";
import { config } from "../config";

export default function CartInitializer() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get(`${config.endpoint}/products`);
        dispatch(setProducts(productsResponse.data));

        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
        
        if (token && productsResponse.data.length > 0) {
          // Fetch cart items
          axios.get(`${config.endpoint}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then((cartResponse) => {
            const cartItems = generateCartItemsFrom(cartResponse.data, productsResponse.data);
            if (cartItems) {
              dispatch(setCartItems(cartItems));
            }
          }).catch((error) => {
            console.error("Failed to load cart:", error);
          });
        }
      } catch (error) {
        console.error("Failed to initialize:", error);
      }
    };

    initializeData();
  }, [dispatch]);

  return null; // This component doesn't render anything
}

