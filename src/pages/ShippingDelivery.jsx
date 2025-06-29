import React, { useEffect } from 'react';
import { Container, Typography, Paper, Box, Divider, List, ListItem, ListItemIcon, ListItemText, Alert } from '@mui/material';
import { Download, Speed, CloudDownload, Security } from '@mui/icons-material';

function ShippingDelivery() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
          Digital Delivery Information
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          Project Bazaar provides instant digital delivery for all purchases. No physical shipping is involved.
        </Alert>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Delivery Process
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Speed color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Instant Access"
                secondary="Access your purchased project immediately after successful payment."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Download color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Download Access"
                secondary="Download links are provided in your account dashboard."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CloudDownload color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Cloud Storage"
                secondary="All project files are securely stored and available for 30 days from purchase."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Security Measures
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Secure Downloads"
                secondary="All downloads are encrypted and secured with industry-standard protocols."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            If you experience any issues with downloading your purchased projects, please contact our support team immediately through the chat widget.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ShippingDelivery;
