"use client";

import { Box, Button, Container, Grid, Typography, IconButton, Paper } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../../store/slices/wishlistSlice";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import ProtectedRoute from "../../components/ProtectedRoute";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";

function WishlistPageContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    enqueueSnackbar("Removed from wishlist", { variant: "info" });
  };

  const handleAddToCart = (product) => {
    enqueueSnackbar("Add to cart functionality - coming soon", { variant: "info" });
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, minHeight: "70vh" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            My Wishlist
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {wishlistItems.length} item(s)
          </Typography>
        </Box>

        {wishlistItems.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
            <FavoriteIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Your wishlist is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Start adding products you love to your wishlist
            </Typography>
            <Button variant="contained" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {wishlistItems.map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item._id}>
                  <Paper sx={{ position: "relative", overflow: "hidden" }}>
                    <IconButton
                      sx={{ 
                        position: "absolute", 
                        top: 8, 
                        right: 8, 
                        zIndex: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)"
                        }
                      }}
                      color="error"
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Box>
                      <ProductCard 
                        product={item} 
                        handleAddToCart={(selectedItem) => handleAddToCart(selectedItem)}
                        hideWishlistButton={true}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistPageContent />
    </ProtectedRoute>
  );
}

