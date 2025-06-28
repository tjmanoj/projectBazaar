import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to log in: " + err.message);
    }
    setLoading(false);
  }

  async function handleResetPassword() {
    try {
      setError("");
      await resetPassword(resetEmail);
      setResetMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setOpenResetDialog(false);
        setResetMessage("");
      }, 3000);
    } catch (err) {
      setError("Failed to reset password: " + err.message);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "white",
                p: 2,
                borderRadius: "50%",
                mb: 2,
              }}
            >
              <LockOutlinedIcon />
            </Box>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "grey.100"
                      : "background.paper",
                },
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "grey.900"
                        : "text.primary",
                  },
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "grey.400"
                        : "divider",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "grey.700"
                      : "text.secondary",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "grey.100"
                      : "background.paper",
                },
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "grey.900"
                        : "text.primary",
                  },
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "grey.400"
                        : "divider",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "grey.700"
                      : "text.secondary",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2,
                gap: 1,
              }}
            >
              <MuiLink
                component="button"
                variant="body2"
                onClick={() => {
                  setOpenResetDialog(true);
                  setResetEmail(email);
                }}
              >
                Forgot password?
              </MuiLink>
              <MuiLink component={Link} to="/signup" variant="body2">
                Don't have an account? Sign Up
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Password Reset Dialog */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your email address and we'll send you a link to reset your
            password.
          </DialogContentText>
          {resetMessage && (
            <Alert
              severity="success"
              sx={{ mt: 2 }}
              onClose={() => setResetMessage("")}
            >
              {resetMessage}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="resetEmail"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetPassword}>Reset Password</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Login;
