import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  Avatar, 
  CircularProgress, 
  Alert, 
  AlertTitle,
  Button,
  Snackbar
} from '@mui/material';
import { 
  Send as SendIcon, 
  Person as PersonIcon, 
  SupportAgent as SupportAgentIcon,
  ErrorOutline as ErrorIcon 
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const AdminChatMessages = () => {
  const { 
    selectedUser, 
    adminMessages, 
    sendAdminMessage, 
    adminLoading, 
    adminError,
    userChats
  } = useChat();
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Find the selected user's info from userChats
  const selectedUserInfo = userChats?.find(user => user.id === selectedUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [adminMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser && currentUser) {
      try {
        setSending(true);
        setError(null);
        await sendAdminMessage(newMessage, selectedUser);
        setNewMessage('');
      } catch (error) {
        console.error("Error sending message from admin:", error);
        setError("Failed to send message. Please try again.");
      } finally {
        setSending(false);
      }
    }
  };

  if (!selectedUser && !adminLoading && !adminError) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          height: '500px', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          p: 3,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Select a Conversation
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Choose a user from the list to view and respond to messages.
        </Typography>
      </Paper>
    );
  }

  // Display global admin loading or error if no user is selected yet
  if (adminLoading && !selectedUser) {
    return (
      <Paper elevation={1} sx={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2, p: 2 }}>
        <Box sx={{textAlign: 'center'}}>
            <CircularProgress />
            <Typography sx={{mt: 1, color: 'text.secondary'}}>Loading conversations...</Typography>
        </Box>
      </Paper>
    );
  }

  if (adminError && !selectedUser) {
    return (
      <Paper elevation={1} sx={{ height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 2, p: 3, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
        <Typography color="error" variant="h6" gutterBottom>Error Loading Chats</Typography>
        <Typography variant="body1" color="text.secondary" sx={{mb: 2}}>{adminError}</Typography>
        {/* Optional: Add a retry button here that calls loadUserChats(true) */}
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        height: '500px', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: 'primary.light' }}>
          <PersonIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'medium' }}>
          {/* Look up the selected user from userChats array to display their email/name */}
          {(() => {
            const userInfo = useChat().userChats?.find(user => user.id === selectedUser);
            return userInfo ? 
              (userInfo.email || userInfo.name) : 
              `User ${selectedUser ? selectedUser.substring(0,6) + '...' : '...'}`;
          })()}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
        {adminMessages === null && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
            <Typography sx={{ml: 1, color: 'text.secondary'}}>Loading messages...</Typography>
          </Box>
        )}
        {adminMessages && adminMessages.length === 0 && (
          <Box sx={{ textAlign: 'center', m: 'auto' }}>
            <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              No messages in this conversation yet.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Send a message to start the chat.
            </Typography>
          </Box>
        )}
        {adminMessages && adminMessages.length > 0 && adminMessages.map((msg, index) => (
          <Box 
            key={msg.id} 
            sx={{
              display: 'flex', 
              justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
              mb: 1.5,
            }}
          >
            <Paper 
              elevation={0}
              sx={{
                p: '10px 14px',
                borderRadius: msg.sender === 'admin' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                bgcolor: msg.sender === 'admin' ? 'primary.main' : 'grey.200',
                color: msg.sender === 'admin' ? 'primary.contrastText' : 'text.primary',
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>{msg.text}</Typography>
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  mt: 0.5, 
                  textAlign: 'right', 
                  fontSize: '0.65rem',
                  opacity: 0.8
                }}
              >
                {msg.timestamp && new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder={sending ? "Sending..." : "Type your message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && !sending && (handleSendMessage(), e.preventDefault())}
            disabled={!selectedUser || adminMessages === null || sending}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: 'grey.100',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'grey.400',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || !selectedUser || adminMessages === null || sending}
            sx={{ 
              ml: 1, 
              bgcolor: 'primary.main', 
              color: 'white', 
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' }
            }}
          >
            {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default AdminChatMessages;
