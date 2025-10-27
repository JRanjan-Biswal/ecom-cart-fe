import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";
import "./Thanks.css";

const Thanks = () => {
  const router = useRouter();
  const [balance, setBalance] = React.useState(null);

  const routeToProducts = () => {
    router.push("/");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const bal = localStorage.getItem("balance");
      setBalance(bal);

      if (!token) {
        router.push("/");
      }
    }
  }, [router]);

  return (
    <>
      <Header />
      <Box className="greeting-container">
        <h2>Yay! It's ordered 😃</h2>
        <p>You will receive an invoice for your order shortly.</p>
        <p>Your order will arrive in 7 business days.</p>
        <p id="balance-overline">Wallet Balance</p>
        <p id="balance">${balance} Available</p>
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
