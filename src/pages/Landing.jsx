import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useThemeContext } from '../context/ThemeContext';
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
  Toolbar,
  Stack,
  IconButton,
  CssBaseline,
  alpha,
  Divider,
  Snackbar,
  Alert,
  Link,
  Avatar,
  Paper,
  useMediaQuery,
  Zoom
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
  Support,
  Instagram,
  Twitter,
  YouTube,
  LinkedIn,
  FormatQuote,
  NavigateNext,
  NavigateBefore,
  Star,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Create motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionContainer = motion(Container);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

// Testimonial Carousel Component
const TestimonialCarousel = ({ testimonials }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        setActiveTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length, isDragging]);

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
    } else if (info.offset.x < -threshold) {
      setActiveTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
    }
    setIsDragging(false);
  };

  return (
    <Box sx={{ position: 'relative', px: { xs: 4, md: 8 } }}>
      <IconButton
        onClick={() => setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
        sx={{
          position: 'absolute',
          left: { xs: -16, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          boxShadow: 2,
          zIndex: 2,
          opacity: { xs: 0, md: 1 },
          visibility: { xs: 'hidden', md: 'visible' },
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) scale(1.1)',
          }
        }}
      >
        <NavigateBefore />
      </IconButton>

      <IconButton
        onClick={() => setActiveTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
        sx={{
          position: 'absolute',
          right: { xs: -16, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          boxShadow: 2,
          zIndex: 2,
          opacity: { xs: 0, md: 1 },
          visibility: { xs: 'hidden', md: 'visible' },
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) scale(1.1)',
          }
        }}
      >
        <NavigateNext />
      </IconButton>

      <MotionBox
        sx={{
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          minHeight: { xs: 480, md: 320 },
          width: '100%',
          touchAction: 'none'
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        {testimonials.map((testimonial, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ 
              opacity: activeTestimonial === index ? 1 : 0,
              x: activeTestimonial === index ? 0 : -100,
              scale: activeTestimonial === index ? 1 : 0.9,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: activeTestimonial === index ? 'auto' : 'none'
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                bgcolor: theme => alpha(theme.palette.primary.main, 0.03),
                border: 1,
                borderColor: theme => alpha(theme.palette.primary.main, 0.1),
                maxWidth: 800,
                width: '100%',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <FormatQuote 
                sx={{ 
                  position: 'absolute',
                  top: -20,
                  left: 20,
                  fontSize: 40,
                  color: 'primary.main',
                  transform: 'scaleX(-1)'
                }} 
              />
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4, 
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontStyle: 'italic',
                    lineHeight: 1.8,
                    color: 'text.primary'
                  }}
                >
                  {testimonial.quote}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      sx={{ 
                        color: i < testimonial.rating ? 'primary.main' : 'action.disabled',
                        fontSize: '1.2rem'
                      }} 
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    sx={{ 
                      width: 60, 
                      height: 60,
                      border: 2,
                      borderColor: 'primary.main'
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </MotionBox>
        ))}
      </MotionBox>

      <Stack 
        direction="row" 
        spacing={1} 
        justifyContent="center" 
        sx={{ mt: 4 }}
      >
        {testimonials.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActiveTestimonial(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: activeTestimonial === index ? 'primary.main' : 'action.disabled',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.2)',
                bgcolor: activeTestimonial === index ? 'primary.main' : 'text.secondary'
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

function Landing() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', requirements: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const currentYear = new Date().getFullYear();

  const testimonials = [
  {
    quote: "Project Bazaar-la project vanginen. Easy-a understand panna mudichu, viva-la super mark kedaichiruku!",
    name: "Karthik S",
    role: "Final Year CSE Student, Coimbatore",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    quote: "Concepts were explained clearly and I got full support until deployment. Best site for engineering projects!",
    name: "Divya R",
    role: "IT Student, Chennai",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/15.jpg"
  },
  {
    quote: "Namma oorla irunthu project vangi top mark vanginen. Support team super!",
    name: "Aravind M",
    role: "ECE Student, Madurai",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/12.jpg"
  },
  {
    quote: "Affordable-a irunthuchu. Unique project idea kuduthanga. Na resume-leum mention panninen.",
    name: "Sowmya L",
    role: "MCA Student, Trichy",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/96.jpg"
  },
  {
    quote: "Romba sikrama project senji kuduthutanga.. Seriously thanks!",
    name: "Vignesh R",
    role: "EEE Final Year, Salem",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/23.jpg"
  }
];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleProjectRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      await addDoc(collection(db, 'project_requests'), {
        name: formData.name,
        email: formData.email,
        requirements: formData.requirements,
        status: 'new',
        createdAt: serverTimestamp()
      });
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', requirements: '' });
      setSnackbar({
        open: true,
        message: 'Request submitted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      setFormError(error.message);
      setSnackbar({
        open: true,
        message: 'Failed to submit request. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      minHeight: '100vh', 
      overflow: 'hidden',
      color: 'text.primary'
    }}>
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
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  display: 'block' // Show on all screen sizes
                }}
              >
                Project Bazaar
              </Typography>
            </Box>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              <Button 
                onClick={() => scrollToSection('features')}
                sx={{
                  color: 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                Features
              </Button>
              <Button 
                onClick={() => scrollToSection('services')}
                sx={{
                  color: 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                Services
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')}
                sx={{
                  color: 'text.primary',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                Contact
              </Button>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'default',
                  pr: 1 // Added right padding in desktop view
                }}
              >
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTheme();
                  }}
                  disableRipple
                  sx={{ 
                    color: 'text.primary',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: 'transparent'
                    },
                    '&:active': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
              <IconButton 
                onClick={toggleTheme}
                sx={{ 
                  color: 'text.primary',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <IconButton 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                sx={{ 
                  color: 'text.primary',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
                  }
                }}
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
          boxShadow: 2
        }}
      >
        <Stack spacing={1} sx={{ p: 2 }}>
          <Button 
            fullWidth 
            onClick={() => scrollToSection('features')}
            sx={{
              color: 'text.primary',
              py: 1.5,
              borderRadius: 1,
              justifyContent: 'flex-start',
              px: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'primary.main',
                bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            Features
          </Button>
          <Button 
            fullWidth 
            onClick={() => scrollToSection('services')}
            sx={{
              color: 'text.primary',
              py: 1.5,
              borderRadius: 1,
              justifyContent: 'flex-start',
              px: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'primary.main',
                bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            Services
          </Button>
          <Button 
            fullWidth 
            onClick={() => scrollToSection('contact')}
            sx={{
              color: 'text.primary',
              py: 1.5,
              borderRadius: 1,
              justifyContent: 'flex-start',
              px: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'primary.main',
                bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
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
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 12, md: 16 }, // Increased top padding to avoid taskbar overlap
          pb: { xs: 8, md: 12 },
          background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
        }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center',
              position: 'relative',
              zIndex: 2 // Ensure text stays above video
            }}>
              <MotionBox
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                sx={{ width: '100%' }}
              >
                <motion.div variants={fadeIn}>
                  <Typography 
                    variant="h1" 
                    color="text.primary"
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      background: theme => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Turn Your Ideas into Reality
                    {/* <Box component="span" sx={{ 
                      color: 'primary.main',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '2px',
                      }
                    }}>
                      Reality
                    </Box> */}
                  </Typography>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 4, 
                      lineHeight: 1.6,
                      maxWidth: '600px',
                      mx: 'auto',
                      opacity: 0.9
                    }}
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
                      onClick={() => navigate('/projects')}
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                        }
                      }}
                    >
                      Get Started
                    </Button>
                  </Stack>
                </motion.div>
                
                {/* Video and Quotes Section */}
                <motion.div 
                  variants={fadeIn}
                  style={{ marginTop: '3rem', width: '100%' }}
                >
                  <Grid container spacing={4} alignItems="center">
                    {/* Left side - Video */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '240px',
                          overflow: 'hidden',
                          borderRadius: 2,
                          boxShadow: theme => `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                        }}
                      >
                        <video
                          src="https://res.cloudinary.com/dejvgjqgh/video/upload/v1751047469/6999824_Motion_Graphics_Animation_1920x1080_spfupf.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background: theme => `linear-gradient(45deg, ${alpha(theme.palette.background.default, 0.7)} 0%, transparent 100%)`,
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    {/* Right side - Animated Quotes */}
                    <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                      <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          position: 'relative',
                        }}
                      >
                        {[
                          {
                            text: "Innovation is the heart of progress",
                            author: "- Project Bazaar"
                          },
                          {
                            text: "Building tomorrow's solutions today",
                            author: "- Tech Leaders"
                          },
                          {
                            text: "Code with confidence, create with purpose",
                            author: "- Developer Community"
                          }
                        ].map((quote, index) => (
                          <MotionBox
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.2 }}
                            sx={{
                              p: 2,
                              borderLeft: 3,
                              borderColor: 'primary.main',
                              bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontStyle: 'italic',
                                color: 'text.primary',
                                fontWeight: 500,
                              }}
                            >
                              {quote.text}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: 'text.secondary',
                                mt: 1,
                              }}
                            >
                              {quote.author}
                            </Typography>
                          </MotionBox>
                        ))}
                      </MotionBox>
                    </Grid>
                  </Grid>
                </motion.div>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6} sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              position: 'relative',
              minHeight: { xs: '300px', md: '500px' }
            }}>
              <Box sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}>
                <video
                  src="/hero-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.02)', // Slight scale to avoid white edges
                    filter: 'brightness(0.95) contrast(1.02)',
                  }}
                />
                {/* Modern gradient overlay */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  background: theme => `
                    linear-gradient(
                      45deg,
                      ${alpha(theme.palette.background.default, 0.7)} 0%,
                      ${alpha(theme.palette.background.default, 0.4)} 50%,
                      ${alpha(theme.palette.background.default, 0.2)} 100%
                    )
                  `,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }} />
                {/* Animated spotlight effect */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 50%)',
                  pointerEvents: 'none',
                  opacity: 0.6,
                  '@keyframes pulse': {
                    '0%': { opacity: 0.4 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 0.4 }
                  },
                  animation: 'pulse 4s ease-in-out infinite'
                }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </MotionBox>

      {/* Features Section */}
      <Box 
        component="section"
        id="features"
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
          
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {[
              {
                icon: <Speed sx={{ fontSize: 40 }} />,
                title: 'Fast Delivery',
                description: 'Projects delivered with full documentation and assistance in seconds.'
              },
              {
                icon: <Security sx={{ fontSize: 40 }} />,
                title: 'Quality Assurance',
                description: 'All projects are tested and reviewed\n thoroughly by skilled developers.'
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
          
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {[
              {
                icon: <Assignment sx={{ fontSize: 48 }} />,
                title: 'Mini Projects',
                description: 'Perfect for semester projects and learning the latest tools and technologies.',
                price: 'Starting at ₹999'
              },
              {
                icon: <Engineering sx={{ fontSize: 48 }} />,
                title: 'Final Year Projects',
                description: 'Get complete solutions with docs, slides, and presentation-ready materials.',
                price: 'Starting at ₹2499'
              },
              {
                icon: <SupervisorAccount sx={{ fontSize: 48 }} />,
                title: 'Mentorship',
                description: '1-on-1 guidance sessions with top industry experts to boost your project skills.',
                price: 'Starting at ₹3499'
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

      {/* Testimonials Section */}
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: theme => mode === 'light'
            ? 'linear-gradient(180deg, #f5f5f7 0%, #fff 100%)'
            : 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)'
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
            sx={{ mb: { xs: 6, md: 8 } }}
          >
            What Our Users Say
          </Typography>

          {/* <TestimonialCarousel testimonials={testimonials} /> */}

          <Box sx={{ position: 'relative', px: { xs: 4, md: 8 } }}>
            {/* Testimonials Carousel */}
            <MotionBox
              sx={{
                display: 'flex',
                overflow: 'hidden',
                position: 'relative',
                minHeight: { xs: 500, md: 300 },
                width: '100%'
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (info.offset.x > 100) {
                  // Swiped right
                  setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
                } else if (info.offset.x < -100) {
                  // Swiped left
                  setActiveTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
                }
              }}
            >
              {testimonials.map((testimonial, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ 
                    opacity: activeTestimonial === index ? 1 : 0,
                    x: activeTestimonial === index ? 0 : -100,
                    scale: activeTestimonial === index ? 1 : 0.9,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: activeTestimonial === index ? 'auto' : 'none'
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 6 },
                      borderRadius: 4,
                      bgcolor: theme => alpha(theme.palette.primary.main, 0.03),
                      border: 1,
                      borderColor: theme => alpha(theme.palette.primary.main, 0.1),
                      maxWidth: 800,
                      width: '100%',
                      position: 'relative',
                      overflow: 'visible'
                    }}
                  >
                    <FormatQuote 
                      sx={{ 
                        position: 'absolute',
                        top: -20,
                        left: 20,
                        fontSize: 40,
                        color: 'primary.main',
                        transform: 'scaleX(-1)'
                      }} 
                    />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 4, 
                          fontSize: { xs: '1rem', md: '1.2rem' },
                          fontStyle: 'italic',
                          lineHeight: 1.8,
                          color: 'text.primary'
                        }}
                      >
                        {testimonial.quote}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            sx={{ 
                              color: i < testimonial.rating ? '#FFD700' : '#E0E0E0',
                              fontSize: '1.2rem',
                              filter: i < testimonial.rating ? 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.4))' : 'none'
                            }} 
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Avatar
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          sx={{ 
                            width: 60, 
                            height: 60,
                            border: 2,
                            borderColor: 'primary.main'
                          }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </MotionBox>
              ))}
            </MotionBox>

            {/* Testimonial Indicators */}
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="center" 
              sx={{ mt: 4 }}
            >
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: activeTestimonial === index ? 'primary.main' : 'action.disabled',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      bgcolor: activeTestimonial === index ? 'primary.main' : 'text.secondary'
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
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
        sx={{ mb: { xs: 1, md: -1 } }}
          >
        Get Started Today
          </Typography>
          
          <Card
        elevation={0}
        sx={{
          border: 'none',
          boxShadow: 'none',
          bgcolor: 'transparent'
        }}
          >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <form onSubmit={handleProjectRequest}>
            <Stack spacing={3}>
              {formError && (
                <Typography color="error" textAlign="center">
                  {formError}
                </Typography>
              )}
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                autoComplete="off"
                disabled={isSubmitting}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: mode === 'dark' ? 'grey.100' : 'background.paper',
                  }
                }}
                InputProps={{
                  sx: {
                    color: mode === 'dark' ? 'grey.900' : 'text.primary',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'grey.400' : 'divider'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { 
                    color: mode === 'dark' ? 'grey.700' : 'text.secondary',
                    '&.Mui-focused': {
                      color: 'primary.main'
                    }
                  }
                }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                autoComplete="off"
                disabled={isSubmitting}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: mode === 'dark' ? 'grey.100' : 'background.paper',
                  }
                }}
                InputProps={{
                  sx: {
                    color: mode === 'dark' ? 'grey.900' : 'text.primary',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'grey.400' : 'divider'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { 
                    color: mode === 'dark' ? 'grey.700' : 'text.secondary',
                    '&.Mui-focused': {
                      color: 'primary.main'
                    }
                  }
                }}
              />
              <TextField
                label="Project Requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                required
                disabled={isSubmitting}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: mode === 'dark' ? 'grey.100' : 'background.paper',
                  }
                }}
                InputProps={{
                  sx: {
                    color: mode === 'dark' ? 'grey.900' : 'text.primary',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'grey.400' : 'divider'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { 
                    color: mode === 'dark' ? 'grey.700' : 'text.secondary',
                    '&.Mui-focused': {
                      color: 'primary.main'
                    }
                  }
                }}
              />
              <Button 
                type="submit"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
        pt: 8,
        pb: 4,
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img 
                  src="/logo.png" 
                  alt="Project Bazaar Logo" 
                  style={{ height: '32px' }} 
                />
                <Typography variant="h6" fontWeight="bold">
                  Project Bazaar
                </Typography>
              </Box>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Making quality projects accessible to every student. We help you turn your ideas into reality with professional guidance and support.
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href="https://www.instagram.com/projectbazaarofficial/" 
                  target="_blank"
                  sx={{ 
                    '&:hover': { 
                      transform: 'translateY(-3px)',
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                    transition: 'transform 0.2s'
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href="https://x.com/ProjectBazaar_" 
                  target="_blank"
                  sx={{ 
                    '&:hover': { 
                      transform: 'translateY(-3px)',
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                    transition: 'transform 0.2s'
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href="https://www.youtube.com/@ProjectBazaarOfficial" 
                  target="_blank"
                  sx={{ 
                    '&:hover': { 
                      transform: 'translateY(-3px)',
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                    transition: 'transform 0.2s'
                  }}
                >
                  <YouTube />
                </IconButton>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href="https://www.linkedin.com/company/projectbazaar/" 
                  target="_blank"
                  sx={{ 
                    '&:hover': { 
                      transform: 'translateY(-3px)',
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                    transition: 'transform 0.2s'
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 6, mb: 4 }} />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'center', md: 'center' }, 
          gap: { xs: 3, md: 2 }
        }}>
          <Typography color="text.secondary" variant="body2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            © {currentYear} Project Bazaar. All rights reserved.
          </Typography>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={{ xs: 1.5, md: 2 }} 
            alignItems="center"
          >
            <Link
              component={RouterLink}
              to="/privacy-policy"
              sx={{ 
                color: 'text.primary',
                textDecoration: 'none',
                px: 2,
                py: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  color: 'primary.main',
                  bgcolor: theme => alpha(theme.palette.primary.main, 0.08)
                } 
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms-of-service"
              sx={{ 
                color: 'text.primary',
                textDecoration: 'none',
                px: 2,
                py: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  color: 'primary.main',
                  bgcolor: theme => alpha(theme.palette.primary.main, 0.08)
                } 
              }}
            >
              Terms of Service
            </Link>
            <Link
              component={RouterLink}
              to="/cancellation-refund"
              sx={{ 
                color: 'text.primary',
                textDecoration: 'none',
                px: 2,
                py: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  color: 'primary.main',
                  bgcolor: theme => alpha(theme.palette.primary.main, 0.08)
                } 
              }}
            >
              Cancellation & Refund
            </Link>
            <Link
              component={RouterLink}
              to="/shipping-delivery"
              sx={{ 
                color: 'text.primary',
                textDecoration: 'none',
                px: 2,
                py: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  color: 'primary.main',
                  bgcolor: theme => alpha(theme.palette.primary.main, 0.08)
                } 
              }}
            >
              Shipping & Delivery
            </Link>
            <Link
              component={RouterLink}
              onClick={() => scrollToSection('contact')}
              sx={{ 
                color: 'text.primary',
                textDecoration: 'none',
                px: 2,
                py: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  color: 'primary.main',
                  bgcolor: theme => alpha(theme.palette.primary.main, 0.08)
                } 
              }}
            >
              Contact Us
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
    
    {/* Scroll to Top Button */}
    <Zoom in={showScrollTop}>
      <Box
        onClick={scrollToTop}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000
        }}
      >
        <IconButton
          color="primary"
          aria-label="scroll to top"
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 3,
            '&:hover': {
              bgcolor: 'background.paper',
              transform: 'translateY(-4px)',
            },
            transition: 'transform 0.2s',
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      </Box>
    </Zoom>

    <Snackbar 
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleCloseSnackbar} 
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box>
)
}

export default Landing;
