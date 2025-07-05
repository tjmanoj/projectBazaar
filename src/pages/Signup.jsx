import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
  IconButton,
  InputAdornment,
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: 2, 
              borderRadius: '50%',
              mb: 2
            }}>
              <PersonAddOutlinedIcon />
            </Box>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="off"
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
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseUp={(e) => e.preventDefault()}
                      edge="end"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'transparent'
                        },
                        color: theme => theme.palette.mode === 'dark' ? 'primary.main' : 'text.secondary'
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "grey.100"
                      : "background.paper",
                  "& input": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "grey.900"
                        : "text.primary",
                  }
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
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
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseUp={(e) => e.preventDefault()}
                      edge="end"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'transparent'
                        },
                        color: theme => theme.palette.mode === 'dark' ? 'primary.main' : 'text.secondary'
                      }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "grey.100"
                      : "background.paper",
                  "& input": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "grey.900"
                        : "text.primary",
                  }
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Sign In
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Signup;
