import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Divider,
  Slide,
  Fade,
  Avatar,
  CircularProgress,
  useTheme,
  Badge
} from '@mui/material';
import { 
  Send as SendIcon, 
  Close as CloseIcon,
  SupportAgent as AdminIcon,
  AccountCircle as UserIcon,
  AccessTime as PendingIcon
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';

const ChatModal = () => {
  const theme = useTheme();
  const { 
    messages, 
    loading, 
    isChatOpen, 
    sendMessage, 
    toggleChat, 
    markMessagesAsRead 
  } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      markMessagesAsRead();
      // Focus the input field when the chat is opened
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }
  }, [isChatOpen, markMessagesAsRead]);

  // Mark admin messages as read whenever new messages arrive and chat is open
  useEffect(() => {
    if (isChatOpen) {
      markMessagesAsRead();
    }
  }, [messages, isChatOpen, markMessagesAsRead]);

  // Always scroll to bottom when chat is opened
  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 10;
      setIsAtBottom(isScrolledToBottom);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
      // Force scroll to bottom after sending
      setIsAtBottom(true);
    }
  };

  if (!isChatOpen) return null;

  return (
    <Fade in={isChatOpen}>
      <Slide direction="up" in={isChatOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: { xs: 'calc(100% - 40px)', sm: 370 },
            height: 480,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: theme.shadows[10],
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.dark', width: 32, height: 32 }}>
                <AdminIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>Custom Project Request</Typography>
            </Box>
            <IconButton 
              color="inherit" 
              onClick={toggleChat} 
              size="small"
              sx={{
                background: 'none',
                borderRadius: 0,
                boxShadow: 'none',
                ml: 1,
                p: 0.5,
                '&:hover': {
                  background: 'none',
                  boxShadow: 'none',
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
          <Divider />

          {/* Messages Area */}
          <Box
            ref={chatContainerRef}
            onScroll={handleScroll}
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
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress size={40} />
              </Box>
            ) : messages.length === 0 ? (
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
                <Avatar sx={{ 
                  bgcolor: 'primary.light', 
                  width: 60, 
                  height: 60,
                  mb: 1
                }}>
                  <AdminIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" color="primary.main">
                  Need a Custom Project?
                </Typography>
                <Typography color="text.secondary">
                  Start a conversation about your custom project requirements and our team will help you!
                </Typography>
              </Box>
            ) : (
              messages.map((message) => (
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
              bgcolor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              boxShadow: theme => theme.shadows[2],
              borderRadius: '0 0 16px 16px',
              minHeight: 56,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              size="medium"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              autoComplete="off"
              inputRef={inputRef}
              multiline
              maxRows={3}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (newMessage.trim()) handleSubmit(e);
                }
              }}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: 'white',
                  fontSize: '1rem',
                  height: 44,
                  px: 2,
                  py: 0,
                  boxShadow: 'none',
                  '& input': {
                    p: 0,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '& fieldset': {
                    borderColor: 'grey.300',
                    borderWidth: 1,
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'grey.400',
                    boxShadow: 'none',
                  },
                },
              }}
              inputProps={{
                style: {
                  padding: 0,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
              sx={{
                flex: 1,
                mr: 1,
                minWidth: 0,
              }}
            />
            <IconButton
              color="primary"
              type="submit"
              disabled={!newMessage.trim()}
              sx={{
                bgcolor: newMessage.trim() ? 'primary.main' : 'action.disabledBackground',
                color: 'white',
                borderRadius: 3,
                width: 44,
                height: 44,
                ml: 0,
                boxShadow: theme => theme.shadows[1],
                transition: 'background 0.2s',
                '&:hover': {
                  bgcolor: newMessage.trim() ? 'primary.dark' : 'action.disabledBackground',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </Fade>
  );
};

// Message bubble component
const MessageBubble = ({ message }) => {
  const theme = useTheme();
  const isAdmin = message.sender === 'admin';
  const hasTimestamp = message.timestamp !== null;
  // Determine tick status
  let tick = null;
  if (isAdmin) {
    // Admin sent message: use read field
    if (message.read) {
      tick = <DoneAllIcon sx={{ fontSize: 16, color: '#2196f3', ml: 0.5, verticalAlign: 'middle' }} titleAccess="Seen" />;
    } else {
      tick = <DoneAllIcon sx={{ fontSize: 16, color: 'grey.500', ml: 0.5, verticalAlign: 'middle' }} titleAccess="Sent" />;
    }
  } else {
    // User sent message: use adminRead field
    if (message.adminRead) {
      tick = <DoneAllIcon sx={{ fontSize: 16, color: '#2196f3', ml: 0.5, verticalAlign: 'middle' }} titleAccess="Seen" />;
    } else {
      tick = <DoneAllIcon sx={{ fontSize: 16, color: 'grey.500', ml: 0.5, verticalAlign: 'middle' }} titleAccess="Sent" />;
    }
  }
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        display: 'flex',
        justifyContent: isAdmin ? 'flex-start' : 'flex-end',
        mb: 1,
        maxWidth: '100%',
      }}
    >
      {isAdmin && (
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main', 
            width: 32, 
            height: 32,
            mr: 1,
            alignSelf: 'flex-end',
            mb: 0.5,
          }}
        >
          <AdminIcon fontSize="small" />
        </Avatar>
      )}
      <Box
        sx={{
          maxWidth: '75%',
          p: 1.5,
          borderRadius: 2,
          bgcolor: isAdmin 
            ? theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' 
            : 'primary.main',
          color: isAdmin 
            ? 'text.primary' 
            : 'white',
          boxShadow: 1,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '8px 8px 0',
            borderColor: isAdmin 
              ? theme.palette.mode === 'dark' 
                ? 'grey.800 transparent transparent' 
                : 'grey.100 transparent transparent' 
              : 'primary.main transparent transparent',
            transform: 'rotate(45deg)',
            bottom: 0,
            [isAdmin ? 'left' : 'right']: -4,
          },
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
            }}
          >
            {hasTimestamp 
              ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : 'Sending...'}
          </Typography>
          {tick}
        </Box>
      </Box>
      {!isAdmin && (
        <Avatar 
          sx={{ 
            bgcolor: 'secondary.main', 
            width: 32, 
            height: 32,
            ml: 1,
            alignSelf: 'flex-end',
            mb: 0.5,
          }}
        >
          <UserIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatModal;
