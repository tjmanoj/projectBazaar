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
  CssBaseline,
  alpha
} from '@mui/material';
import { 
  School, 
  Assignment, 
  SupervisorAccount,
  Engineering,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  ArrowForward,
  Security,
  Speed,
  Support
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';

// Wrap MUI components with motion
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionContainer = motion(Container);

function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img 
                src="/logo.png" 
                alt="Project Bazaar Logo" 
                style={{ height: '32px' }} 
              />
              <Typography 
                variant="h6" 
                component="h1" 
                color="primary" 
                fontWeight="bold"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Project Bazaar
              </Typography>
            </Box>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              <Button color="inherit" href="#services">Services</Button>
              <Button color="inherit" href="#pricing">Pricing</Button>
              <Button color="inherit" href="#contact">Contact</Button>
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ ml: 2 }}
              >
                Get Started
              </Button>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <IconButton color="inherit" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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

      {/* Hero Section */}
      <MotionBox
        component="section"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 0 },
          background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
        }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                <motion.div variants={fadeIn}>
                  <Typography 
                    variant="h1" 
                    color="text.primary"
                    sx={{ mb: 2 }}
                  >
                    Turn Your Ideas into{' '}
                    <Box component="span" sx={{ color: 'primary.main' }}>
                      Reality
                    </Box>
                  </Typography>
                </motion.div>
                
                <motion.div variants={fadeIn}>
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    sx={{ mb: 4, lineHeight: 1.6 }}
                  >
                    Get professional CS projects with expert guidance. Perfect for students and beginners.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem'
                      }}
                    >
                      Get Started
                    </Button>
                  </Stack>
                </motion.div>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <MotionBox
                component="img"
                src="src/assets/hero-image.jpg"
                alt="Project Development"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: 600,
                  filter: mode === 'dark' ? 'brightness(0.8)' : 'none'
                }}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </Grid>
          </Grid>
        </Container>
      </MotionBox>

      {/* Features Section */}
      <Box 
        component="section"
        sx={{ 
          py: { xs: 8, md: 12 },
          background: theme => mode === 'light' 
            ? 'linear-gradient(180deg, #fff 0%, #f5f5f7 100%)'
            : 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)'
        }}
      >
        <MotionContainer
          maxWidth="lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: { xs: 6, md: 8 } }}
          >
            Why Choose Us
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                icon: <Speed sx={{ fontSize: 40 }} />,
                title: 'Fast Delivery',
                description: 'Projects delivered with full documentation and assistance in seconds.'
              },
              {
                icon: <Security sx={{ fontSize: 40 }} />,
                title: 'Quality Assurance',
                description: 'All projects are tested and reviewed thoroughly by skilled developers.'
              },
              {
                icon: <Support sx={{ fontSize: 40 }} />,
                title: '24/7 Support',
                description: 'Expert support available for implementation and technical questions.'
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  variants={fadeIn}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 4,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionContainer>
      </Box>

      {/* Services Section */}
      <Box component="section" id="services" sx={{ py: { xs: 8, md: 12 } }}>
        <MotionContainer
          maxWidth="lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ mb: { xs: 6, md: 8 } }}
          >
            Our Services
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                icon: <Assignment sx={{ fontSize: 48 }} />,
                title: 'Mini Projects',
                description: 'Perfect for semester assignments and learning new technologies.',
                price: 'Starting at ₹499'
              },
              {
                icon: <Engineering sx={{ fontSize: 48 }} />,
                title: 'Final Year Projects',
                description: 'Complete solution with documentation and presentation.',
                price: 'Starting at ₹1499'
              },
              {
                icon: <SupervisorAccount sx={{ fontSize: 48 }} />,
                title: 'Mentorship',
                description: '1-on-1 guidance sessions with industry experts.',
                price: 'Starting at ₹2499'
              }
            ].map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  variants={fadeIn}
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      {service.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      {service.price}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionContainer>
      </Box>

      {/* Contact Section */}
      <Box 
        component="section" 
        id="contact"
        sx={{ 
          py: { xs: 8, md: 12 },
          bgcolor: 'background.subtle'
        }}
      >
        <MotionContainer
          maxWidth="md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            Get Started Today
          </Typography>
          
          <Card>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing={3}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required
                  />
                  <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                  />
                  <TextField
                    label="Project Requirements"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                  <Button 
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                  >
                    Submit Request
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </MotionContainer>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'background.paper',
          py: 4,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="bold">
                  Project Bazaar
                </Typography>
                <Typography color="text.secondary">
                  Making quality projects accessible to every student
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={3}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Services
                    </Typography>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                      Mini Projects
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                      Final Year Projects
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                      Mentorship
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Support
                    </Typography>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                      FAQ
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                      Contact
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start' }}>
                      Terms
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography 
                color="text.secondary" 
                align="center"
                sx={{ mt: 2 }}
              >
                © {currentYear} Project Bazaar. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;
