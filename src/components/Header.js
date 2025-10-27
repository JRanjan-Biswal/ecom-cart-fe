import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useRouter } from "next/navigation";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? localStorage.getItem("username") : null;
  const isLogIn = user ? true : false;

  const loggingOut = () => {
    localStorage.clear();
    router.push("/");
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box
        className="header-title"
        onClick={() => {
          router.push("/");
        }}
      >
        <img src="/logo_light.svg" alt="EcomCart-icon"></img>
      </Box>

      {/* the children here signifies the textfield from line no. 163 ,that header returns as child in the product.js file
    this states that => this.props.children */}
      {children}

      {hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            router.push("/");
          }}
        >
          Back to explore
        </Button>
      )}

      {isLogIn && (
        <Stack direction="row" justifyContent="center" alignItems="center">
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => {
              router.push("/checkout");
            }}
          >
            <Avatar alt={user} src="/avatar.png" />
            <div>{localStorage.getItem("username")}</div>
          </div>
          <Button variant="text" onClick={loggingOut}>
            logout
          </Button>
        </Stack>
      )}

      {!isLogIn && !hasHiddenAuthButtons && (
        <Stack direction="row">
          <Button
            onClick={() => {
              router.push("/login");
            }}
          >
            login
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              router.push("/register");
            }}
          >
            register
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
