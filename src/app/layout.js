import React from "react";
import Providers from "../providers/Providers";
import ReduxProvider from "../store/ReduxProvider";
import CartInitializer from "../components/CartInitializer";
import "../index.css";

export const metadata = {
  title: "EcomCart",
  description: "EcomCart - Always stay with the trend. Browse, select and checkout",
  keywords: "ecommerce, shopping, online store, cart, products",
  authors: [{ name: "Jyoti Ranjan Biswal" }],
  creator: "Jyoti Ranjan Biswal",
  publisher: "Jyoti Ranjan Biswal",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "EcomCart",
    description: "EcomCart - Always stay with the trend. Browse, select and checkout",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EcomCart",
    description: "EcomCart - Always stay with the trend. Browse, select and checkout",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Providers>
            <CartInitializer />
            {children}
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}

