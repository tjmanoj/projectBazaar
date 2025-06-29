import React from 'react';
import { Container, Typography, Paper, Box, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoneyOff, Assignment, EventAvailable, Warning } from '@mui/icons-material';

function CancellationRefund() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
          Cancellation & Refund Policy
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          We want you to be completely satisfied with your purchase. Please read our cancellation and refund policy carefully.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Cancellation Policy
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EventAvailable color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="24-Hour Cancellation Window"
                secondary="You can cancel your order within 24 hours of purchase for a full refund."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Post-Download Cancellation"
                secondary="Orders cannot be cancelled once the project files have been downloaded."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Refund Policy
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <MoneyOff color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Refund Eligibility"
                secondary="Refunds are processed within 5-7 business days after approval."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Assignment color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Documentation Required"
                secondary="Please provide order details and reason for refund when submitting a request."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            For any queries regarding cancellations or refunds, please contact our support team through the chat widget or email us at support@projectbazaar.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default CancellationRefund;
