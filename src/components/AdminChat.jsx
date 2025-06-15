import React, { useEffect } from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import AdminChatUserList from './AdminChatUserList';
import AdminChatMessages from './AdminChatMessages';
import { useChat } from '../context/ChatContext';

const AdminChat = () => {
  const { loadUserChats } = useChat();
  
  // Load user chats when the component mounts
  useEffect(() => {
    loadUserChats(true);
  }, [loadUserChats]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="600" color="primary.main">
        Customer Support Chat
      </Typography>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AdminChatUserList />
          </Grid>
          <Grid item xs={12} md={8}>
            <AdminChatMessages />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminChat;
