import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProjects, updateProject, createProject, deleteProject, updateProjectStatus } from '../services/projectService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    technologies: '',
    features: '',
    thumbnail: '',
    demoLink: '',
    status: 'draft'
  });

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const isUserAdmin = userDoc.exists() && userDoc.data().isAdmin === true;
        setIsAdmin(isUserAdmin);
        if (!isUserAdmin) {
          // Redirect non-admin users
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        navigate('/dashboard');
      }
    };
    checkAdminStatus();
  }, [currentUser, navigate]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      // Get all projects without category filter for admin
      const projectsList = await fetchProjects();
      if (!projectsList) {
        setError('No projects found');
        setProjects([]);
      } else {
        setProjects(projectsList);
      }
    } catch (err) {
      setError('Failed to load projects: ' + err.message);
      console.error('Error loading projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        price: project.price?.toString() || '',
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
        features: Array.isArray(project.features) ? project.features.join(', ') : '',
        thumbnail: project.thumbnail || '',
        demoLink: project.demoLink || '',
        status: project.status || 'draft'
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        technologies: '',
        features: '',
        thumbnail: '',
        demoLink: '',
        status: 'draft'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      technologies: '',
      features: '',
      thumbnail: '',
      demoLink: '',
      status: 'draft'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const projectData = {
        ...formData,
        price: Number(formData.price),
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      };

      if (editingProject) {
        await updateProject({
          id: editingProject.id,
          ...projectData,
          status: projectData.status || editingProject.status
        });
      } else {
        await createProject(projectData);
      }

      handleCloseDialog();
      await loadProjects();
    } catch (err) {
      setError('Failed to save project: ' + err.message);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        loadProjects();
      } catch (err) {
        setError('Failed to delete project: ' + err.message);
      }
    }
  };

  const handleToggleStatus = async (project) => {
    try {
      const newStatus = project.status === 'published' ? 'draft' : 'published';
      await updateProjectStatus(project.id, newStatus);
      loadProjects();
    } catch (err) {
      setError('Failed to update project status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Project Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" noWrap>
                  {project.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {project.category}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {project.description?.substring(0, 100)}...
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label={project.status}
                    color={project.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={`₹${project.price}`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleStatus(project)}
                    title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {project.status === 'published' ? 
                      <VisibilityIcon /> : 
                      <VisibilityOffIcon />
                    }
                  </IconButton>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(project)}
                    color="primary"
                    title="Edit project"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(project.id)}
                    color="error"
                    title="Delete project"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="mini-project">Mini Project</MenuItem>
                  <MenuItem value="final-year">Final Year</MenuItem>
                  <MenuItem value="mentorship">Mentorship</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  type="number"
                  fullWidth
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Technologies (comma-separated)"
                  fullWidth
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  helperText="Example: React, Firebase, Material-UI"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Features (comma-separated)"
                  fullWidth
                  required
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  helperText="Example: Authentication, CRUD operations, Real-time updates"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Thumbnail URL"
                  fullWidth
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Demo Link"
                  fullWidth
                  value={formData.demoLink}
                  onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default AdminPanel;
