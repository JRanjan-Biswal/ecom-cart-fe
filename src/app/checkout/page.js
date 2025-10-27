"use client";

import Checkout from "../../components/Checkout";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  );
}

