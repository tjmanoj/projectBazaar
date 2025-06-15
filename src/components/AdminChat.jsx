import React, { useEffect } from 'react';
import { Grid, Typography, Box, Paper, CircularProgress } from '@mui/material';
import AdminChatUserList from './AdminChatUserList';
import AdminChatMessages from './AdminChatMessages';
import { useChat } from '../context/ChatContext';

const AdminChat = () => {
  const { loadUserChats, userChats } = useChat();
  
  // Load user chats when the component mounts
  useEffect(() => {
    // Force load chats when component mounts
    loadUserChats(true);
    
    // Refresh chats every 30 seconds to catch new conversations
    const intervalId = setInterval(() => {
      loadUserChats(true);
    }, 30000);
    
    return () => clearInterval(intervalId);
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
