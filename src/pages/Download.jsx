import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchProjectById, checkPurchaseStatus } from "../services/projectService";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import {
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
  Description as DescriptionIcon
} from "@mui/icons-material";

function Download() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    loadProjectAndCheckPurchase();
  }, [projectId]);

  const loadProjectAndCheckPurchase = async () => {
    try {
      setLoading(true);
      const [projectData, purchased] = await Promise.all([
        fetchProjectById(projectId),
        checkPurchaseStatus(projectId, currentUser?.uid)
      ]);

      if (!projectData) {
        setError("Project not found");
        return;
      }

      setProject(projectData);
      setHasPurchased(purchased);

      if (!purchased) {
        setError("You need to purchase this project first");
        setTimeout(() => navigate(`/payment/${projectId}`), 2000);
      }
    } catch (err) {
      setError("Failed to load project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Open the source code URL in a new tab
    if (project?.sourceCodeUrl) {
      window.open(project.sourceCodeUrl, '_blank');
    }
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

  if (!hasPurchased) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Redirecting to payment page...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Your Purchase is Complete!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              You can now download the source code for {project?.title}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <List>
          <ListItem>
            <ListItemIcon>
              <ArticleIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Project Documentation"
              secondary="Complete documentation with setup instructions"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CodeIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Source Code"
              secondary="Full source code with all dependencies"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DescriptionIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Additional Resources"
              secondary="Related files and assets"
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download Source Code
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Download;
