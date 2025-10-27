"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import axios from "axios";
import { config } from "../../config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { logout, initializeAuth } from "../../store/slices/authSlice";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HistoryIcon from "@mui/icons-material/History";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { addToCart } from "../../store/slices/cartSlice";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    name: "",
    mobile: "",
    addresses: [],
    balance: 0,
    orders: [],
  });

  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", mobile: "" });
  const [newAddress, setNewAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
    setInitialized(true);
  }, [dispatch]);

  useEffect(() => {
    if (!initialized) return;

    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const storedToken = window.localStorage.getItem("token");
        
        if (!storedToken) {
          enqueueSnackbar("Please login to view profile", { variant: "warning" });
          router.push("/login");
          return;
        }
        
        if (isAuthenticated && token) {
          setLoading(false);
          fetchProfile();
        } else {
          // Wait a bit for auth to initialize
          setTimeout(() => {
            const token = window.localStorage.getItem("token");
            if (token) {
              fetchProfile();
              setLoading(false);
            } else {
              setLoading(false);
              router.push("/login");
            }
          }, 500);
        }
      }
    };

    checkAuth();
  }, [initialized, isAuthenticated, token]);

  const fetchProfile = async () => {
    const currentToken = token || (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);
    
    if (!currentToken) {
      console.log("No token found");
      return;
    }

    try {
      const response = await axios.get(`${config.endpoint}/user/profile`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      
      // Update profile data
      setProfileData({
        name: response.data.name || "",
        mobile: response.data.mobile || "",
        addresses: response.data.addresses || [],
        balance: response.data.balance || 0,
        orders: response.data.orders || [],
      });
      setEditValues({ 
        name: response.data.name || "", 
        mobile: response.data.mobile || "" 
      });
      setLoading(false);
    } catch (error) {
      console.error("Profile fetch error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Set default values even on error
      const defaultBalance = typeof window !== "undefined" ? window.localStorage.getItem("balance") : 0;
      setProfileData({
        name: "",
        mobile: "",
        addresses: [],
        balance: defaultBalance || 0,
        orders: [],
      });
      
      enqueueSnackbar(
        error.response?.data?.message || "Unable to fetch complete profile. Some features may be limited.", 
        { variant: "warning" }
      );
      setLoading(false);
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({ name: profileData.name || "", mobile: profileData.mobile || "" });
  };

  const handleSave = async (field) => {
    const currentToken = token || (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);
    
    if (!currentToken) {
      enqueueSnackbar("Please login to update profile", { variant: "warning" });
      return;
    }

    try {
      const updateData = {};
      updateData[field] = editValues[field];

      console.log("Updating profile with:", updateData);

      const response = await axios.put(
        `${config.endpoint}/user/profile`,
        updateData,
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        }
      );

      console.log("Profile update response:", response.data);

      setProfileData((prev) => ({ ...prev, [field]: editValues[field] }));
      setEditingField(null);
      enqueueSnackbar(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Error response:", error.response?.data);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update profile",
        { variant: "error" }
      );
    }
  };

  const handleAddAddress = async () => {
    if (newAddress.length < 20) {
      enqueueSnackbar("Address must be at least 20 characters", { variant: "warning" });
      return;
    }

    const currentToken = token || (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);
    
    if (!currentToken) {
      enqueueSnackbar("Please login to add address", { variant: "warning" });
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddress },
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        }
      );

      setProfileData((prev) => ({ ...prev, addresses: response.data }));
      setNewAddress("");
      setShowAddressForm(false);
      enqueueSnackbar("Address added successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Failed to add address", { variant: "error" });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const currentToken = token || (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);
    
    if (!currentToken) {
      enqueueSnackbar("Please login to delete address", { variant: "warning" });
      return;
    }

    try {
      const response = await axios.delete(`${config.endpoint}/user/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      setProfileData((prev) => ({ ...prev, addresses: response.data }));
      enqueueSnackbar("Address deleted successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to delete address", { variant: "error" });
    }
  };

  const handleReorder = async (order) => {
    const currentToken = token || (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);
    
    if (!currentToken) {
      enqueueSnackbar("Please login to reorder", { variant: "warning" });
      return;
    }

    try {
      // Add all items from the order to cart via API
      for (const item of order.items) {
        await axios.post(
          `${config.endpoint}/cart`,
          { productId: item.productId, qty: item.qty },
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
      }
      
      enqueueSnackbar("Items added to cart successfully!", { variant: "success" });
      router.push("/cart");
    } catch (error) {
      enqueueSnackbar("Failed to add items to cart", { variant: "error" });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    enqueueSnackbar("Logged out successfully", { variant: "success" });
    router.push("/");
    window.location.reload();
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 4, display: "flex", justifyContent: "center", minHeight: "80vh" }}>
          <CircularProgress />
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4, minHeight: "80vh" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          My Profile
        </Typography>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user || (typeof window !== "undefined" ? window.localStorage.getItem("username") : "")}
                  </Typography>
                </Box>

                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                    </Box>
                    {editingField !== "name" && (
                      <IconButton size="small" onClick={() => handleEdit("name")}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  {editingField === "name" ? (
                    <Box display="flex" gap={1} mt={1}>
                      <TextField
                        fullWidth
                        size="small"
                        value={editValues.name}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      />
                      <IconButton onClick={() => handleSave("name")} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleCancel} color="error">
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography variant="body1">
                      {profileData.name || "Not set"}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Mobile Number
                      </Typography>
                    </Box>
                    {editingField !== "mobile" && (
                      <IconButton size="small" onClick={() => handleEdit("mobile")}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  {editingField === "mobile" ? (
                    <Box display="flex" gap={1} mt={1}>
                      <TextField
                        fullWidth
                        size="small"
                        value={editValues.mobile}
                        onChange={(e) => setEditValues({ ...editValues, mobile: e.target.value })}
                      />
                      <IconButton onClick={() => handleSave("mobile")} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleCancel} color="error">
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography variant="body1">
                      {profileData.mobile || "Not set"}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Wallet Balance
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{profileData.balance}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Addresses</Typography>
                <Button
                  startIcon={<AddLocationIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  Add Address
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {showAddressForm && (
                <Box mb={3}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter your address (minimum 20 characters)"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Box display="flex" gap={1}>
                    <Button variant="contained" onClick={handleAddAddress}>
                      Add
                    </Button>
                    <Button variant="outlined" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}

              {profileData.addresses.length === 0 ? (
                <Typography color="text.secondary">
                  No addresses added yet
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {profileData.addresses.map((address) => (
                    <Box
                      key={address._id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      border="1px solid"
                      borderColor="divider"
                      borderRadius={1}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                        {address.address}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <HistoryIcon color="primary" />
                <Typography variant="h6">Order History</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {profileData.orders.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No orders yet
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {profileData.orders.map((order) => (
                    <Box
                      key={order._id}
                      border="1px solid"
                      borderColor="divider"
                      borderRadius={1}
                      p={2}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Order #{order._id.slice(-8)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleReorder(order)}
                        >
                          Re-order
                        </Button>
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" fontWeight="medium" mb={1}>
                          Items:
                        </Typography>
                        {order.items.map((item, idx) => (
                          <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                            <Box display="flex" alignItems="center" gap={2} flex={1}>
                              <img 
                                src={item.image} 
                                alt={item.name}
                                style={{ 
                                  width: 50, 
                                  height: 50, 
                                  objectFit: "cover", 
                                  borderRadius: 4 
                                }}
                              />
                              <Box>
                                <Typography variant="body2">{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Qty: {item.qty}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" fontWeight="medium">
                              ₹{item.cost * item.qty}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight="medium">
                          Total:
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ₹{order.total}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
