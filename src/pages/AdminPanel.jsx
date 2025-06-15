import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProjects, fetchAllProjects, updateProject, createProject, deleteProject, updateProjectStatus } from '../services/projectService';
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
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Chat as ChatIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import AdminChat from '../components/AdminChat';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc as firestoreDoc, deleteDoc } from 'firebase/firestore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useChat } from '../context/ChatContext';

function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    technologies: '',
    features: '',
    thumbnail: '',
    demoLink: '',
    sourceCodeUrl: '',
    downloadUrl: '',
    demoVideoDesktopUrl: '', // New field for desktop demo video
    demoVideoMobileUrl: '',  // New field for mobile demo video
    status: 'draft'
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifLoading, setNotifLoading] = useState(true);
  const { setSelectedUser } = useChat(); // Import context hook

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

  // Fetch admin notifications
  useEffect(() => {
    if (!isAdmin) return;
    setNotifLoading(true);
    const notifRef = collection(db, 'admin_notifications');
    const notifQuery = query(notifRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(notifQuery, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
      setNotifLoading(false);
    });
    return unsubscribe;
  }, [isAdmin]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      // Get all projects including drafts and published for admin
      const projectsList = await fetchAllProjects();
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
        sourceCodeUrl: project.sourceCodeUrl || '',
        downloadUrl: project.downloadUrl || '',
        demoVideoDesktopUrl: project.demoVideoDesktopUrl || '',
        demoVideoMobileUrl: project.demoVideoMobileUrl || '',
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
        sourceCodeUrl: '',
        downloadUrl: '',
        demoVideoDesktopUrl: '',
        demoVideoMobileUrl: '',
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Notification menu handlers
  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  // Handle notification click: mark as read, go to chat tab, select user
  const handleNotifClick = async (notif) => {
    handleNotifClose();
    // Mark notification as read
    await updateDoc(firestoreDoc(db, 'admin_notifications', notif.id), { read: true });
    // Switch to chat tab and select user
    setActiveTab(1);
    if (setSelectedUser) setSelectedUser(notif.userId);
  };

  const handleNotifDelete = async (notifId) => {
    try {
      await deleteDoc(firestoreDoc(db, 'admin_notifications', notifId));
    } catch (err) {
      setError('Failed to delete notification: ' + err.message);
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
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Paper sx={{ borderRadius: 2, flex: 1 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            aria-label="admin tabs"
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Projects" 
              id="tab-0" 
              aria-controls="tabpanel-0" 
            />
            <Tab 
              icon={<ChatIcon />} 
              label="Customer Chat" 
              id="tab-1" 
              aria-controls="tabpanel-1" 
            />
          </Tabs>
        </Paper>
        {/* Notification Bell */}
        {isAdmin && (
          <Tooltip title="User Chat Notifications">
            <IconButton color="primary" onClick={handleNotifOpen} sx={{ ml: 2 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        )}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
          PaperProps={{ style: { minWidth: 320 } }}
        >
          {notifLoading ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : notifications.length === 0 ? (
            <MenuItem disabled>No notifications</MenuItem>
          ) : notifications.map((notif) => (
            <MenuItem key={notif.id} onClick={() => handleNotifClick(notif)} selected={!notif.read} sx={{ 
              bgcolor: !notif.read ? 'rgba(255,0,0,0.08)' : undefined, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: 1,
              pr: 1,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <ListItemAvatar>
                  <Avatar>{notif.userEmail?.[0]?.toUpperCase() || 'U'}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notif.userEmail || notif.userId}
                  secondary={notif.message?.substring(0, 60) || 'New message'}
                />
                {!notif.read && <Badge color="error" variant="dot" sx={{ ml: 1 }} />}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); handleNotifDelete(notif.id); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Projects Tab Panel */}
      <div
        role="tabpanel"
        hidden={activeTab !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
      >
        {activeTab === 0 && (
          <>
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
          </>
        )}
      </div>

      {/* Chat Tab Panel */}
      <div
        role="tabpanel"
        hidden={activeTab !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
      >
        {activeTab === 1 && <AdminChat />}
      </div>

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
              <Grid item xs={12}>
                <TextField
                  label="Source Code URL"
                  fullWidth
                  value={formData.sourceCodeUrl}
                  onChange={(e) => setFormData({ ...formData, sourceCodeUrl: e.target.value })}
                  helperText="URL where the source code zip file is stored"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Download URL"
                  fullWidth
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  helperText="URL for downloading the project files"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Desktop Demo Video (YouTube URL)"
                  fullWidth
                  value={formData.demoVideoDesktopUrl}
                  onChange={(e) => setFormData({ ...formData, demoVideoDesktopUrl: e.target.value })}
                  helperText="YouTube URL for desktop demo video preview"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mobile Demo Video (YouTube URL)"
                  fullWidth
                  value={formData.demoVideoMobileUrl}
                  onChange={(e) => setFormData({ ...formData, demoVideoMobileUrl: e.target.value })}
                  helperText="YouTube URL for mobile demo video preview"
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
