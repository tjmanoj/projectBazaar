import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  CardMedia,
  alpha,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  ShoppingCart as CartIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { Project } from '../types/Project';
import { useAuth } from '../context/AuthContext';
import { checkPurchaseStatus } from '../services/projectService';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  onDemoClick?: (project: Project) => void;
}

export function ProjectCard({ project, onClick, onDemoClick }: ProjectCardProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(project.price);

  useEffect(() => {
    const checkPurchase = async () => {
      if (currentUser && project.id) {
        const purchased = await checkPurchaseStatus(project.id, currentUser.uid);
        setHasPurchased(purchased);
      }
    };
    checkPurchase();
  }, [currentUser, project.id]);

  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDemoClick) onDemoClick(project);
  };
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        minHeight: { xs: 'auto', sm: project.thumbnail && !imageError ? '540px' : '380px' },
        maxHeight: { xs: 'none', sm: project.thumbnail && !imageError ? '540px' : '380px' },
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: { xs: 'none', sm: 'translateY(-4px)' },
          boxShadow: { xs: 2, sm: 4 }
        },
        overflow: 'hidden'
      }}
    >
      {project.thumbnail && !imageError && (
        <CardMedia
          component="img"
          height={200}
          image={project.thumbnail}
          alt={`${project.title} thumbnail`}
          onError={handleImageError}
          sx={{ 
            objectFit: 'cover',
            objectPosition: 'center top',
            borderBottom: 1,
            borderColor: 'divider',
            width: '100%',
            height: { xs: '200px', sm: '240px' }
          }}
        />
      )}
      <CardContent sx={{
        flexGrow: 1, 
        pt: 1.5,
        pb: '8px !important',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        overflow: 'hidden',
        minWidth: 0,
        px: { xs: 1.5, sm: 2 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          gap: 2,
          mb: 1
        }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              minWidth: 0,
              flex: 1
            }}
          >
            {project.title}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            color="primary"
            sx={{
              fontWeight: 700,
              whiteSpace: 'nowrap',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              bgcolor: theme => 
                theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.08)'
                  : 'rgba(33, 150, 243, 0.08)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              lineHeight: 1,
              letterSpacing: 0.5,
            }}
          >
            {formattedPrice}
          </Typography>
        </Box>

        <Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: showFullDesc ? 'block' : '-webkit-box',
              WebkitLineClamp: showFullDesc ? 'unset' : 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
              height: showFullDesc ? 'auto' : '4.5em',
              mb: 1,
              minWidth: 0
            }}
          >
            {project.description}
          </Typography>
          {project.description && project.description.length > 120 && !showFullDesc && (
            <Button 
              size="small" 
              sx={{ 
                p: 0, 
                minHeight: 0, 
                minWidth: 0, 
                fontSize: '0.8em',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline'
                }
              }} 
              onClick={() => setShowFullDesc(true)}
            >
              See more...
            </Button>
          )}
          {showFullDesc && (
            <Button 
              size="small" 
              sx={{ 
                p: 0, 
                minHeight: 0, 
                minWidth: 0, 
                fontSize: '0.8em',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline'
                }
              }} 
              onClick={() => setShowFullDesc(false)}
            >
              See less
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 1 }}>
              <Chip 
                size="small" 
                label={project.category} 
                color="primary" 
                sx={{ 
                  textTransform: 'capitalize'
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.75,
                width: '100%',
                maxWidth: '100%'
              }}
            >
              {project.technologies.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.75rem',
                    height: '20px'
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.75rem'
            }}
          >
            Updated {project.updatedAt.toLocaleDateString()}
          </Typography> */}
        </Box>
      </CardContent>

      <CardActions sx={{ 
        px: { xs: 1.5, sm: 2 },
        py: 1.5,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        gap: 1
      }}>
        {(project.demoVideoDesktopUrl || project.demoVideoMobileUrl) && (
          <Button
            size="small"
            startIcon={<PlayIcon />}
            onClick={handleDemoClick}
            sx={{ 
              minWidth: 'auto',
              px: { xs: 1.5, sm: 2 },
              '&:hover': {
                bgcolor: theme => 
                  theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            Demo
          </Button>
        )}
        {hasPurchased ? (
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => navigate(`/download/${project.id}`)}
            sx={{ minWidth: 'auto', px: { xs: 1.5, sm: 2 } }}
          >
            Download
          </Button>
        ) : (
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<CartIcon />}
            onClick={() => onClick?.(project)}
            sx={{ minWidth: 'auto', px: { xs: 1.5, sm: 2 } }}
          >
            Buy Now
          </Button>
        )}
      </CardActions>
    </Card>
  );
}