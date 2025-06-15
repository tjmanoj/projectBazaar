import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { Project } from '../types/Project';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  onDemoClick?: (project: Project) => void;
}

export function ProjectCard({ project, onClick, onDemoClick }: ProjectCardProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(project.price);

  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDemoClick) onDemoClick(project);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        minHeight: { xs: '340px', sm: '380px' },
        maxHeight: { xs: '340px', sm: '380px' },
        minWidth: 0,
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1, 
        pt: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        overflow: 'hidden',
        minWidth: 0
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
            height: '2.4em',
            mb: 1,
            minWidth: 0
          }}
        >
          {project.title}
        </Typography>

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
            <Button size="small" sx={{ p: 0, minHeight: 0, minWidth: 0, fontSize: '0.8em' }} onClick={() => setShowFullDesc(true)}>
              See more...
            </Button>
          )}
          {showFullDesc && (
            <Button size="small" sx={{ p: 0, minHeight: 0, minWidth: 0, fontSize: '0.8em' }} onClick={() => setShowFullDesc(false)}>
              See less
            </Button>
          )}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1,
          mt: 'auto' 
        }}>
          <Stack direction="row" spacing={1}>
            <Chip 
              size="small" 
              label={project.category} 
              color="primary" 
              sx={{ textTransform: 'capitalize' }}
            />
            <Chip 
              size="small" 
              label={formattedPrice} 
              variant="outlined"
            />
          </Stack>
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              maxHeight: '48px',
              overflow: 'hidden'
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

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: '0.75rem',
            mt: 'auto'
          }}
        >
          Updated {project.updatedAt.toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions sx={{ 
        p: 2, 
        pt: 1,
        borderTop: 1,
        borderColor: 'divider'
      }}>
        {project.demoVideoDesktopUrl || project.demoVideoMobileUrl ? (
          <Button
            size="small"
            startIcon={<PlayIcon />}
            onClick={handleDemoClick}
            sx={{ mr: 1 }}
          >
            Demo
          </Button>
        ) : null}
        <Button 
          size="small" 
          color="primary"
          variant="contained"
          startIcon={<CartIcon />}
          onClick={() => onClick?.(project)}
        >
          Buy Now
        </Button>
      </CardActions>
    </Card>
  );
}