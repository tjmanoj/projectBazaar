import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchProjectById, checkPurchaseStatus } from "../services/projectService";
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import Switch from '@mui/material/Switch';

// Helper to get embeddable YouTube URL with all branding removed
function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('youtube.com/shorts/')[1].split(/[?&]/)[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3` : '';
}

function Demo() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("desktop");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjectById(projectId);
        if (!projectData) {
          setError("Project not found");
          return;
        }
        setProject(projectData);

        // Check purchase status if user is logged in
        if (currentUser) {
          const purchased = await checkPurchaseStatus(projectId, currentUser.uid);
          setHasPurchased(purchased);
        }
      } catch (err) {
        setError("Failed to load project: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectId, currentUser]);

  const handlePurchase = () => {
    navigate(`/payment/${projectId}`);
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

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(project?.price || 0);

  const isVideoAvailable = viewMode === 'desktop' ? 
    Boolean(project?.demoVideoDesktopUrl) : 
    Boolean(project?.demoVideoMobileUrl);
    console.log("Desktop URL:", project?.demoVideoDesktopUrl);
    console.log("Mobile URL:", project?.demoVideoMobileUrl);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 8 }}>
      {/* Video Player */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          backgroundColor: 'black',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          aspectRatio: viewMode === 'desktop' ? '16/9' : '16/9',
          transition: 'aspect-ratio 0.3s ease-in-out',
        }}
        onMouseEnter={() => setVideoPlaying(true)}
        onMouseLeave={() => setVideoPlaying(false)}
      >
        {isVideoAvailable ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <iframe
              width={viewMode === 'desktop' ? '100%' : '56.25%'}
              height="100%"
              src={`${getYouTubeEmbedUrl(
                viewMode === 'desktop' 
                  ? project.demoVideoDesktopUrl 
                  : project.demoVideoMobileUrl
              )}${videoPlaying ? '&autoplay=1&mute=1' : '&autoplay=0&mute=1'}`}
              title={`${project.title} - ${viewMode} Demo`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: viewMode === 'desktop' ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                margin: 'auto',
                border: 'none',
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <Typography color="text.secondary">
              No {viewMode} demo available
            </Typography>
          </Box>
        )}
      </Box>

      {/* View Toggle Switch (Material UI Switch) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2, gap: 2 }}>
        <Typography
          variant="body1"
          sx={{
            color: viewMode === 'desktop' ? 'primary.main' : 'text.secondary',
            fontWeight: viewMode === 'desktop' ? 700 : 400,
            transition: 'color 0.2s',
          }}
        >
          Desktop
        </Typography>
        <Switch
          checked={viewMode === 'mobile'}
          onChange={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
          color="primary"
          inputProps={{ 'aria-label': 'toggle mobile/desktop view' }}
        />
        <Typography
          variant="body1"
          sx={{
            color: viewMode === 'mobile' ? 'primary.main' : 'text.secondary',
            fontWeight: viewMode === 'mobile' ? 700 : 400,
            transition: 'color 0.2s',
          }}
        >
          Mobile
        </Typography>
      </Box>

      {/* Project Details */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {project?.title}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip 
                label={project?.category} 
                color="primary" 
                sx={{ textTransform: 'capitalize' }}
              />
              <Chip 
                label={formattedPrice} 
                color="secondary"
                variant="outlined"
              />
            </Stack>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {project?.technologies.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>

          <Typography variant="body1" paragraph>
            {project?.description}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Key Features
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {project?.features.map((feature, index) => (
              <Typography
                key={index}
                component="li"
                variant="body1"
                sx={{ mb: 1 }}
              >
                {feature}
              </Typography>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              position: { md: 'sticky' },
              top: { md: 24 }
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h5" gutterBottom>
                {formattedPrice}
              </Typography>
              {!hasPurchased ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Get instant access to:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2">
                      Complete source code
                    </Typography>
                    <Typography component="li" variant="body2">
                      Documentation and setup guide
                    </Typography>
                    <Typography component="li" variant="body2">
                      All project assets and resources
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={handlePurchase}
                  >
                    Buy Now
                  </Button>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    align="center"
                  >
                    Secure payment via Razorpay
                  </Typography>
                </>
              ) : (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    You already own this project
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => navigate(`/download/${project.id}`)}
                  >
                    Download
                  </Button>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Demo;
