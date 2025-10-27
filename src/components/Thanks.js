"use client";

import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { config } from "../config";
import Footer from "./Footer";
import Header from "./Header";
import "./Thanks.css";

const Thanks = () => {
  const router = useRouter();
  const [balance, setBalance] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchBalance = async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newBalance = response.data.balance || 0;
      setBalance(newBalance);
      localStorage.setItem("balance", newBalance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const routeToProducts = () => {
    router.push("/");
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const bal = localStorage.getItem("balance");
      
      if (!token) {
        router.push("/");
      } else {
        setBalance(bal);
        // Fetch latest balance from backend
        fetchBalance();
      }
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      <Box className="greeting-container">
        <h2>Yay! It's ordered 😃</h2>
        <p>You will receive an invoice for your order shortly.</p>
        <p>Your order will arrive in 7 business days.</p>
        <p id="balance-overline">Wallet Balance</p>
        <p id="balance">₹{balance || 0} Available</p>
        <Button
          variant="contained"
          size="large"
          id="continue-btn"
          onClick={routeToProducts}
        >
          Continue Shopping
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default Thanks;
