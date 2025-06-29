import React from 'react';
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
  Gavel,
  Security,
  Assignment,
  Person,
  Payment
} from '@mui/icons-material';

function TermsOfService() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
          Terms of Service
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Please read these terms of service carefully before using Project Bazaar.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            User Agreement
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Account Responsibility"
                secondary="You are responsible for maintaining the security of your account and all activities under it."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Assignment color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Project Usage"
                secondary="Projects are for educational and learning purposes. Commercial use requires separate licensing."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Payment & Delivery
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Payment color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Payment Terms"
                secondary="All payments are processed securely through Razorpay. Prices are in INR and inclusive of taxes."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Project Access"
                secondary="Access to project files is granted immediately after successful payment verification."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Legal Compliance
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Gavel color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Governing Law"
                secondary="These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            For any questions about these terms, please contact our legal team at legal@projectbazaar.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default TermsOfService;
