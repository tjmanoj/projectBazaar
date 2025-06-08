import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchProjectById, updatePaymentStatus } from "../services/projectService";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Chip
} from "@mui/material";
import {
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  ShoppingCart as ShoppingCartIcon
} from "@mui/icons-material";

function Payment() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjectById(projectId);
      if (!projectData) {
        setError("Project not found");
        return;
      }
      setProject(projectData);
    } catch (err) {
      setError("Failed to load project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: project.price * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Project Bazaar",
        description: `Payment for ${project.title}`,
        image: '/src/assets/logo.png', // Local path for Razorpay logo
        handler: async (response) => {
          try {
            // Handle successful payment
            await updatePaymentStatus(
              projectId,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              currentUser.uid,
              'completed'
            );
            setPaymentSuccess(true);
          } catch (err) {
            setError("Failed to verify payment: " + err.message);
          }
        },
        prefill: {
          name: currentUser?.displayName || '',
          email: currentUser?.email || '',
          contact: currentUser?.phoneNumber || ''
        },
        notes: {
          projectId: projectId,
          userId: currentUser.uid
        },
        theme: {
          color: "#1976d2"
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        setError('Payment failed: ' + response.error.description);
        // Update payment status in Firebase
        updatePaymentStatus(
          projectId,
          response.error.metadata.order_id,
          response.error.metadata.payment_id,
          currentUser.uid,
          'failed'
        );
      });
      razorpayInstance.open();
    } catch (err) {
      setError("Payment initialization failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (paymentSuccess) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Fade in>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              background: 'linear-gradient(to right bottom, #4caf50, #2e7d32)',
              color: 'white'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Thank you for your purchase. You can now download the source code.
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<DownloadIcon />}
              onClick={() => navigate(`/download/${projectId}`)}
              sx={{ 
                color: '#2e7d32',
                bgcolor: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Download Source Code
            </Button>
          </Paper>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Complete Your Purchase
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {project?.title}
        </Typography>
        <Box sx={{ my: 3 }}>
          <Typography variant="body1" paragraph>
            {project?.description}
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            ₹{project?.price}
          </Typography>
        </Box>
        {project?.features && (
          <Box sx={{ mb: 3 }}>
            {project.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                sx={{ m: 0.5 }}
                size="small"
              />
            ))}
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={handlePayment}
        >
          Pay Now
        </Button>
      </Paper>
    </Container>
  );
}

export default Payment;
