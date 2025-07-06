import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Stack,
  Switch,
  Breadcrumbs,
  Link,
  Skeleton,
  Alert,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  ShoppingCart as ShoppingCartIcon,
  Share as ShareIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { checkPurchaseStatus } from '../services/projectService';
import { alpha } from '@mui/material/styles';

// Helper to get embeddable YouTube URL
function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('youtube.com/shorts/')[1].split(/[?&]/)[0];
  } else if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const theme = useTheme();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('desktop');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        
        if (!projectDoc.exists()) {
          setError('Project not found');
          return;
        }

        const projectData = {
          id: projectDoc.id,
          ...projectDoc.data()
        };

        setProject(projectData);

        if (currentUser) {
          const purchased = await checkPurchaseStatus(projectId, currentUser.uid);
          setHasPurchased(purchased);
        }
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, currentUser]);

  const handlePurchase = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/project/${projectId}` } });
      return;
    }
    navigate(`/payment/${projectId}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href
      });
    } catch (err) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(project?.price || 0);

  const isVideoAvailable = viewMode === 'desktop' ? 
    Boolean(project?.demoVideoDesktopUrl) : 
    Boolean(project?.demoVideoMobileUrl);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link 
            component="button"
            onClick={() => navigate('/')}
            underline="hover"
            color="inherit"
          >
            Home
          </Link>
          <Link
            component="button"
            onClick={() => navigate('/projects')}
            underline="hover"
            color="inherit"
          >
            Projects
          </Link>
          <Typography color="text.primary">{project.title}</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Video and Images */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}>
            {/* Video Section */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                backgroundColor: 'black',
                overflow: 'hidden',
                aspectRatio: '16/9',
              }}
              onMouseEnter={() => setVideoPlaying(true)}
              onMouseLeave={() => setVideoPlaying(false)}
            >
              {isVideoAvailable ? (
                <iframe
                  key={viewMode}
                  src={getYouTubeEmbedUrl(
                    viewMode === 'desktop' 
                      ? project.demoVideoDesktopUrl 
                      : project.demoVideoMobileUrl
                  ) + '?controls=1&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3' + (videoPlaying ? '&autoplay=1&mute=1' : '&autoplay=0&mute=1')}
                  title={project.title + ' - ' + viewMode + ' Demo'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="grey.500">
                    No {viewMode} demo video available
                  </Typography>
                </Box>
              )}
            </Box>

            {/* View Toggle */}
            <Box sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: viewMode === 'desktop' ? 'primary.main' : 'text.secondary',
                    fontWeight: viewMode === 'desktop' ? 700 : 400,
                  }}
                >
                  Desktop
                </Typography>
                <Switch
                  checked={viewMode === 'mobile'}
                  onChange={() => setViewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop')}
                  color="primary"
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: viewMode === 'mobile' ? 'primary.main' : 'text.secondary',
                    fontWeight: viewMode === 'mobile' ? 700 : 400,
                  }}
                >
                  Mobile
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Project Description Section */}
          <Paper elevation={0} sx={{ 
            mt: 3,
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {project.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Stack spacing={1}>
              {project.features.map((feature, index) => (
                <Typography 
                  key={index} 
                  component="div" 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  • {feature}
                </Typography>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Technologies Used
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              {project.technologies.map((tech, index) => (
                <Chip
                  key={index}
                  label={tech}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column - Project Info and Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ 
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 24
          }}>
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ flex: 1 }}>
                  {project.title}
                </Typography>
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Stack>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip 
                  label={project.category} 
                  color="primary"
                  sx={{ textTransform: 'capitalize' }}
                />
                <Chip 
                  label={formattedPrice}
                  color="secondary"
                  variant="outlined"
                />
              </Stack>
            </Box>

            {hasPurchased ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={() => navigate('/download/' + project.id)}
              >
                Download Project
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handlePurchase}
              >
                Buy Now
              </Button>
            )}

            {showShareToast && (
              <Alert 
                severity="success" 
                sx={{ mt: 2 }}
                onClose={() => setShowShareToast(false)}
              >
                Project URL copied to clipboard!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function LoadingSkeleton() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={400}
          sx={{ borderRadius: 2 }}
        />
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={200}
          sx={{ borderRadius: 2 }}
        />
      </Grid>
    </Grid>
  );
}
