"use client";

import React from "react";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/system";
import theme from "../theme";

export default function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        autoHideDuration={3000}
        preventDuplicate
        dense={false}
      >
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

