import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  Stack,
  Chip,
  Switch,
  Button
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";

// Helper to get embeddable YouTube URL from any YouTube link
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
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

export default function DemoModal({ open, project, onClose }) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const navigate = useNavigate();
  // reset playback when switching view modes
  useEffect(() => {
    setVideoPlaying(false);
  }, [viewMode]);

  if (!project) return null;

  const handlePurchase = () => {
    onClose(); // Close the modal
    navigate(`/payment/${project.id}`); // Navigate to payment page
  };

  const isVideoAvailable = viewMode === 'desktop' ? 
    Boolean(project?.demoVideoDesktopUrl) : 
    Boolean(project?.demoVideoMobileUrl);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(project?.price || 0);

  // handler to toggle view and stop playback
  const handleViewToggle = () => {
    setViewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop');
    // This will trigger the useEffect to reset video playback
    // Video will reload because of the key={viewMode} prop on the iframe
  };

  // handler for Buy Now button
  const handleBuyNow = () => {
    // Add your buy now logic here
    // For example, navigating to a checkout page or opening a payment dialog
    navigate('/checkout');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <Paper elevation={0} sx={{ position: 'relative' }}>
        {/* Video Player */}
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
              key={viewMode} // Force re-render on viewMode change
              src={`${getYouTubeEmbedUrl(
                viewMode === 'desktop' 
                  ? project.demoVideoDesktopUrl 
                  : project.demoVideoMobileUrl
              )}?controls=1&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3${videoPlaying ? '&autoplay=1&mute=1' : '&autoplay=0&mute=1'}`}
              title={`${project.title} - ${viewMode} Demo`}
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

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {/* View Mode Toggle Switch */}
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center', 
              mb: 3,
              gap: 2
            }}
          >
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
              onChange={handleViewToggle}
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

          <Typography variant="h5" gutterBottom>
            {project?.title}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
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

            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
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

          <Typography variant="body1" color="text.secondary" paragraph>
            {project?.description}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
            Hover over the video to play (tap on mobile)
          </Typography>

          {/* Buy Now Button */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handlePurchase}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Buy Now
            </Button>
          </Box>
        </Box>
      </Paper>
    </Dialog>
  );
}
