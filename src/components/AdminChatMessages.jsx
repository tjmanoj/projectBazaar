import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  CircularProgress,
  useTheme,
  Divider
} from '@mui/material';
import { 
  Send as SendIcon, 
  Person as PersonIcon,
  SupportAgent as AdminIcon,
  AccessTime as PendingIcon
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';

const AdminChatMessages = () => {
  const theme = useTheme();
  const { 
    adminMessages, 
    selectedUser, 
    userChats,
    sendAdminMessage
  } = useChat();
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [adminMessages]);

  // Focus the input field when a user is selected
  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      sendAdminMessage(newMessage, selectedUser);
      setNewMessage('');
    }
  };

  // Get selected user's details
  const selectedUserDetails = userChats.find(chat => chat.id === selectedUser);

  if (!selectedUser) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          height: '500px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ 
          textAlign: 'center', 
          p: 3,
          color: 'text.secondary'
        }}>
          <Typography variant="h6" gutterBottom>
            Select a conversation
          </Typography>
          <Typography variant="body2">
            Choose a customer from the list to view their messages
          </Typography>
        </Box>
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
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {selectedUserDetails?.name || selectedUser}
          </Typography>
          <Typography variant="caption">
            {selectedUserDetails?.email || 'Customer'}
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* Messages Area */}
      <Box
        ref={chatContainerRef}
        sx={{
          p: 2,
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
        }}
      >
        {!adminMessages ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={40} />
          </Box>
        ) : adminMessages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            gap: 2,
            textAlign: 'center',
            px: 3
          }}>
            <Typography variant="body1" color="text.secondary">
              No messages in this conversation yet.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Send a message to start the conversation.
            </Typography>
          </Box>
        ) : (
          adminMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your reply..."
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoComplete="off"
          inputRef={inputRef}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <IconButton 
          color="primary" 
          type="submit" 
          disabled={!newMessage.trim()}
          sx={{ 
            bgcolor: newMessage.trim() ? 'primary.main' : 'action.disabledBackground',
            color: 'white',
            '&:hover': { 
              bgcolor: 'primary.dark' 
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

// Message bubble component
const MessageBubble = ({ message }) => {
  const theme = useTheme();
  const isAdmin = message.sender === 'admin';
  const hasTimestamp = message.timestamp !== null;
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        display: 'flex',
        justifyContent: isAdmin ? 'flex-end' : 'flex-start',
        mb: 1,
        maxWidth: '100%',
      }}
    >
      {!isAdmin && (
        <Avatar 
          sx={{ 
            bgcolor: 'secondary.main', 
            width: 32, 
            height: 32,
            mr: 1,
            alignSelf: 'flex-end',
            mb: 0.5,
          }}
        >
          <PersonIcon fontSize="small" />
        </Avatar>
      )}
      
      <Box
        sx={{
          maxWidth: '70%',
          p: 1.5,
          borderRadius: 2,
          bgcolor: isAdmin 
            ? 'primary.main'
            : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          color: isAdmin 
            ? 'white'
            : 'text.primary',
          boxShadow: 1,
        }}
      >
        <Typography variant="body2">{message.text}</Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          mt: 0.5,
          gap: 0.5,
        }}>
          {!hasTimestamp && (
            <PendingIcon sx={{ fontSize: 12, opacity: 0.7 }} />
          )}
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.7,
              fontStyle: hasTimestamp ? 'normal' : 'italic',
              color: isAdmin ? 'rgba(255,255,255,0.8)' : 'text.secondary'
            }}
          >
            {hasTimestamp 
              ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : 'Sending...'}
          </Typography>
        </Box>
      </Box>
      
      {isAdmin && (
        <Avatar 
          sx={{ 
            bgcolor: 'primary.dark', 
            width: 32, 
            height: 32,
            ml: 1,
            alignSelf: 'flex-end',
            mb: 0.5,
          }}
        >
          <AdminIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
};

export default AdminChatMessages;
