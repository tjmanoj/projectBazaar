import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Paper,
} from '@mui/material';
import {
  Code as CodeIcon,
  VideoLibrary as VideoIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import DemoModal from '../components/DemoModal';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDemoModal, setOpenDemoModal] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId);
        const projectDoc = await getDoc(projectRef);
        
        if (!projectDoc.exists()) {
          setError('Project not found');
          setLoading(false);
          return;
        }

        setProject({ id: projectDoc.id, ...projectDoc.data() });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!project) return null;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(project.price || 0);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ pt: 12 }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 4 }}
          >
            Back to Projects
          </Button>

          <Grid container spacing={6}>
            <Grid item xs={12} md={7}>
              <MotionBox
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                {project.thumbnail && (
                  <Box
                    component="img"
                    src={project.thumbnail}
                    alt={project.title}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 2,
                      boxShadow: theme => `0 8px 32px ${theme.palette.primary.main}20`
                    }}
                  />
                )}
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={5}>
              <MotionBox
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <Typography variant="h3" gutterBottom fontWeight="bold">
                  {project.title}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                  {project.technologies?.map((tech, index) => (
                    <Chip 
                      key={index} 
                      label={tech} 
                      color="primary" 
                      variant="outlined" 
                      size="small"
                    />
                  ))}
                </Stack>

                <Typography variant="h4" color="primary" gutterBottom>
                  {formattedPrice}
                </Typography>

                <Typography color="text.secondary" paragraph>
                  {project.description}
                </Typography>

                <Stack spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => navigate(`/payment/${project.id}`)}
                  >
                    Buy Now
                  </Button>

                  {(project.demoVideoDesktopUrl || project.demoVideoMobileUrl) && (
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      startIcon={<VideoIcon />}
                      onClick={() => setOpenDemoModal(true)}
                    >
                      View Demo
                    </Button>
                  )}
                </Stack>
              </MotionBox>
            </Grid>
          </Grid>

          {project.features && project.features.length > 0 && (
            <>
              <Divider sx={{ my: 8 }} />
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="h4" gutterBottom>
                    Features
                  </Typography>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
                    <Grid container spacing={3}>
                      {project.features.map((feature, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <CodeIcon color="primary" />
                            <Typography>{feature}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Container>

      <DemoModal
        open={openDemoModal}
        onClose={() => setOpenDemoModal(false)}
        project={project}
      />
    </Box>
  );
}

export default ProjectDetails;
