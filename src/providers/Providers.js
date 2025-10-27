"use client";

import React from "react";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/system";
import theme from "../theme";

export default function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        preventDuplicate
      >
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

