import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider 
} from '@mui/material';
import { 
  Description,
  Gavel,
  Security,
  Shield
} from '@mui/icons-material';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
          Privacy Policy
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Information We Collect
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Personal Information"
                secondary="Name, email address, and contact details provided during registration or communication."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Payment Information"
                secondary="We do not store payment details. All transactions are processed securely through Razorpay."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            How We Use Your Information
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Service Provision"
                secondary="To provide access to purchased projects and support services."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Gavel color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Legal Compliance"
                secondary="To comply with legal obligations and prevent misuse of our services."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            For any privacy-related concerns, please contact our privacy team at privacy@projectbazaar.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default PrivacyPolicy;
