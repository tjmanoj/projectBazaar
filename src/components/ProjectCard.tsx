import React from 'react';
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
  Code as CodeIcon,
} from '@mui/icons-material';
import { Project } from '../types/Project';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  onDemoClick?: (project: Project) => void;
}

export function ProjectCard({ project, onClick, onDemoClick }: ProjectCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(project.price);

  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (onDemoClick) {
      onDemoClick(project);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            mb: 1
          }}
        >
          {project.title}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {project.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
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
          <Stack 
            direction="row" 
            spacing={0.5} 
            sx={{ 
              flexWrap: 'wrap',
              gap: 0.5
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
          </Stack>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ fontSize: '0.75rem' }}
        >
          Updated {project.updatedAt.toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {project.demoLink && (
          <Button
            size="small"
            startIcon={<PlayIcon />}
            onClick={handleDemoClick}
            sx={{ mr: 1 }}
          >
            Demo
          </Button>
        )}
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