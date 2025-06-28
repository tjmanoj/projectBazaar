import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchProjects } from "../services/projectService";
import { ProjectCard } from "../components/ProjectCard";
import DemoModal from "../components/DemoModal";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  Container,
  Grid,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useThemeContext } from "../context/ThemeContext";
import {
  Brightness4,
  Brightness7,
  AccountCircle,
  AdminPanelSettings,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Home,
  School,
  Assignment,
  SupervisorAccount,
} from "@mui/icons-material";

function ProjectList() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoProject, setDemoProject] = useState(null);
  const [demoOpen, setDemoOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    loadProjects();
    checkAdminStatus();
  }, [category]);

  const checkAdminStatus = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      setIsAdmin(userDoc.exists() && userDoc.data().isAdmin === true);
    } catch (err) {
      console.error("Error checking admin status:", err);
      setIsAdmin(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedProjects = await fetchProjects(
        category !== "all" ? category : undefined
      );
      setProjects(fetchedProjects);
    } catch (err) {
      setError("Failed to load projects: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError("Failed to log out");
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/payment/${project.id}`);
  };

  const handleDemoClick = (project) => {
    setDemoProject(project);
    setDemoOpen(true);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(8px)",
          backgroundColor:
            mode === "dark"
              ? "rgba(0, 0, 0, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: "56px", sm: "64px" },
              display: "flex",
              position: "relative",
            }}
          >


            {/* Logo and Brand */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                justifyContent: "flex-start",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src="https://res.cloudinary.com/dejvgjqgh/image/upload/v1749394373/logo_dkpogl.png"
                  alt="Project Bazaar Logo"
                  style={{
                    height: "32px",
                    width: "auto",
                  }}
                />
                <Typography
                  variant="h6"
                  component="h1"
                  color="primary"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Project Bazaar
                </Typography>
              </Box>
            </Box>

            {/* Navigation Tabs - Hidden on mobile */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                height: "100%",
                mr: 1,
              }}
            >
              <Tabs
                value={category}
                onChange={(_, newValue) => setCategory(newValue)}
                sx={{
                  minHeight: "100%",
                  "& .MuiTab-root": {
                    minHeight: "100%",
                    py: 1.5,
                    px: 1.5,
                    minWidth: "auto",
                    width: "auto",
                    fontSize: "0.875rem",
                    textTransform: "none",
                    fontWeight: 500,
                  },
                  "& .MuiTab-root:hover": {
                    backgroundColor: "action.hover",
                    opacity: 1,
                  },
                  "& .MuiTabs-indicator": {
                    height: 3,
                  }
                }}
              >
                <Tab label="All Projects" value="all" />
                <Tab label="Mini Projects" value="mini-project" />
                <Tab label="Final Year" value="final-year" />
                <Tab label="Mentorship" value="mentorship" />
              </Tabs>
            </Box>

            {/* Right side actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {/* Theme Toggle - Hidden on mobile */}
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                size="small"
                disableRipple
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  "&:hover": { backgroundColor: "transparent" },
                  "&:active": { backgroundColor: "transparent" }
                }}
              >
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              {/* Admin Button */}
              {isAdmin && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => navigate("/admin")}
                  sx={{
                    minWidth: 0,
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <AdminPanelSettings fontSize="small" />
                </Button>
              )}

              {/* User Profile */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  ml: 0.5,
                }}
              >
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{
                    p: 0.5,
                    display: { xs: 'flex', md: 'none' },
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                  disableRipple
                >
                  <AccountCircle 
                    fontSize="small" 
                    color="primary"
                  />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "text.secondary",
                    fontSize: "0.8rem",
                  }}
                >
                  {currentUser?.email}
                </Typography>
              </Box>

              {/* Logout Button */}
              <Button
                color="inherit"
                size="small"
                onClick={handleLogout}
                sx={{
                  minWidth: 0,
                  p: 1,
                  ml: 0.5,
                  border: 'none',
                  '&:hover': {
                    border: 'none',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <LogoutIcon fontSize="small" color="primary" />
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 4,
            maxWidth: "100%",
            overflow: "auto",
          }}
        >
          <Tabs
            value={category}
            onChange={(_, newValue) => setCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 48, // Reduce tab height
              "& .MuiTab-root": {
                minHeight: 48,
                py: 1,
              },
            }}
          >
            <Tab label="All Projects" value="all" />
            <Tab label="Mini Projects" value="mini-project" />
            <Tab label="Final Year" value="final-year" />
            <Tab label="Mentorship" value="mentorship" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid
            container
            spacing={1.5} // Reduced from 2.5 to 1.5 for less gap
            alignItems="stretch"
            sx={{
              mx: "auto",
              width: "100%",
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr', // 1 card per row on mobile
                sm: '1fr 1fr', // 2 cards per row on desktop
              },
              gap: 4, // Reduced from 12 to 4px for less row space
            }}
          >
            {projects.map((project) => (
              <Box
                key={project.id}
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'stretch',
                }}
              >
                <ProjectCard
                  project={project}
                  onClick={handleProjectClick}
                  onDemoClick={handleDemoClick}
                />
              </Box>
            ))}
            {!loading && projects.length === 0 && (
              <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  {category === "all"
                    ? "No projects available yet"
                    : `No ${category} projects available`}
                </Typography>
              </Box>
            )}
          </Grid>
        )}
        <DemoModal
          open={demoOpen}
          project={demoProject}
          onClose={() => setDemoOpen(false)}
        />
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            bgcolor: "background.default",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <AccountCircle color="primary" />
            <Typography
              variant="subtitle2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentUser?.email}
            </Typography>
          </Box>
          <Divider />
          <List>
            <ListItem
              button
              selected={category === "all"}
              onClick={() => {
                setCategory("all");
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>
                <Home color={category === "all" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="All Projects" />
            </ListItem>
            <ListItem
              button
              selected={category === "mini-project"}
              onClick={() => {
                setCategory("mini-project");
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>
                <Assignment
                  color={category === "mini-project" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="Mini Projects" />
            </ListItem>
            <ListItem
              button
              selected={category === "final-year"}
              onClick={() => {
                setCategory("final-year");
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>
                <School color={category === "final-year" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Final Year" />
            </ListItem>
            <ListItem
              button
              selected={category === "mentorship"}
              onClick={() => {
                setCategory("mentorship");
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>
                <SupervisorAccount
                  color={category === "mentorship" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="Mentorship" />
            </ListItem>
          </List>
          <Divider />
          <List>
            {isAdmin && (
              <ListItem
                button
                onClick={() => {
                  navigate("/admin");
                  handleDrawerToggle();
                }}
              >
                <ListItemIcon>
                  <AdminPanelSettings color="primary" />
                </ListItemIcon>
                <ListItemText primary="Admin Panel" />
              </ListItem>
            )}
            <ListItem
              button
              onClick={() => {
                toggleTheme();
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </ListItemIcon>
              <ListItemText
                primary={mode === "dark" ? "Light Mode" : "Dark Mode"}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default ProjectList;
