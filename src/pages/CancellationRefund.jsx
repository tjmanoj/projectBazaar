import React, { useEffect } from 'react';
import { Container, Typography, Paper, Box, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoneyOff, Assignment, Warning, Info } from '@mui/icons-material';

function CancellationRefund() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
          No Refund Policy
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Please note that we maintain a strict no-refund policy for all purchases. We encourage you to carefully review project details before making a purchase.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Important Information
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Info color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="No Refunds"
                secondary="All sales are final. We do not offer refunds on any purchases."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Before Purchase"
                secondary="Please review all project details, requirements, and preview materials thoroughly before making a purchase."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Project Access
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Assignment color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Immediate Access"
                secondary="You will receive immediate access to project files after successful payment."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MoneyOff color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Payment Final"
                secondary="Once payment is processed and project files are made available, the transaction is final."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            If you have any questions about a project before purchase, please use our chat widget.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default CancellationRefund;
