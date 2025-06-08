import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  TextField, 
  Typography, 
  Box,
  useTheme,
  useMediaQuery,
  Toolbar,
  Stack,
  IconButton,
  CssBaseline
} from '@mui/material';
import { 
  School, 
  Assignment, 
  SupervisorAccount,
  Star,
  Engineering,
  LiveHelp,
  Brightness4,
  Brightness7,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';

function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" component="h1" color="primary" fontWeight="bold" 
              sx={{ flexGrow: { xs: 1, md: 0 } }}>
              Project Bazaar
            </Typography>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
              <Button color="inherit" href="#services">Services</Button>
              <Button color="inherit" href="#pricing">Pricing</Button>
              <Button color="inherit" href="#contact">Contact</Button>
              <IconButton 
                onClick={toggleTheme} 
                color="inherit"
                sx={{ 
                  ml: 1,
                  borderRadius: 1,
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                sx={{ 
                  mr: 1,
                  borderRadius: 1,
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <Box
        sx={{
          display: { xs: mobileMenuOpen ? 'block' : 'none', md: 'none' },
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 1100,
        }}
      >
        <Stack spacing={1} sx={{ p: 2 }}>
          <Button fullWidth color="inherit" href="#services" onClick={() => setMobileMenuOpen(false)}>
            Services
          </Button>
          <Button fullWidth color="inherit" href="#pricing" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Button>
          <Button fullWidth color="inherit" href="#contact" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Button>
        </Stack>
      </Box>

      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          mt: mobileMenuOpen ? 8 : 0
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              fontWeight: 'bold'
            }}
          >
            Affordable CS Projects for Students
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Mini Projects, Final Year Projects, Mentorship & More
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            color="secondary"
            onClick={() => navigate('/login')}
            sx={{ 
              py: 2,
              px: 4,
              fontSize: '1.2rem'
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }} id="services">
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
          What We Offer
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Assignment sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Custom Mini Projects
                </Typography>
                <Typography>
                  Quick turnaround small-scale projects for early semesters with documentation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <Engineering sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Final Year Projects
                </Typography>
                <Typography>
                  Major projects with source code, report, and guidance on viva preparation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <SupervisorAccount sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Mentorship & Guidance
                </Typography>
                <Typography>
                  1-on-1 sessions with experienced developers to help you understand your project better.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box 
        sx={{ 
          bgcolor: 'grey.100', 
          py: { xs: 6, md: 8 },
          px: { xs: 2, md: 0 }
        }} 
        id="pricing"
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ 
              mb: { xs: 4, md: 6 }, 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Simple Pricing
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  transform: 'scale(1)', 
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.03)',
                    boxShadow: 6
                  } 
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Starter
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ my: 2 }}>
                    ₹499
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Basic mini project + source code + instructions
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/login')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                transform: 'scale(1.05)',
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.08)' },
                border: 2,
                borderColor: 'primary.main'
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Advanced
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ my: 2 }}>
                    ₹1499
                  </Typography>
                  <Typography>
                    Customized project + report + screenshots
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', transform: 'scale(1)', transition: '0.3s', '&:hover': { transform: 'scale(1.03)' } }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Premium
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ my: 2 }}>
                    ₹2499
                  </Typography>
                  <Typography>
                    Final year project + presentation + mentorship call
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box 
        sx={{ 
          py: { xs: 6, md: 8 },
          px: { xs: 2, md: 0 },
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default'
        }} 
        id="contact"
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ 
              mb: { xs: 4, md: 6 }, 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Get In Touch
          </Typography>
          <Card elevation={theme.palette.mode === 'dark' ? 2 : 1}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <TextField
                    label="Project Requirements"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <Button 
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      alignSelf: { xs: 'stretch', sm: 'flex-start' }
                    }}
                  >
                    Send Request
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          &copy; {currentYear} Project Bazaar. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Landing;
