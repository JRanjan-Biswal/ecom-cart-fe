"use client";

import { Box, Typography } from "@mui/material";
import "./Marquee.css";

const Marquee = () => {
  const quotes = [
    "🚀 Fast & Secure Delivery",
    "🔒 100% Secure Payments",
    "💰 Best Price Guarantee",
    "🎁 Exclusive Offers Daily",
    "🛡️ Easy Returns & Refunds",
    "⭐ 1000+ Happy Customers"
  ];

  return (
    <Box className="marquee-container">
      <Box className="marquee">
        <Box className="marquee-content">
          <Typography variant="body1" className="marquee-text">
            {quotes.join(" • ")}
          </Typography>
        </Box>
        <Box className="marquee-content">
          <Typography variant="body1" className="marquee-text">
            {quotes.join(" • ")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Marquee;

