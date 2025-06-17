import React, { useState, useRef, useEffect, useContext } from 'react';
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
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Send as SendIcon, 
  Close as CloseIcon,
  SupportAgent as AdminIcon,
  AccountCircle as UserIcon,
  AccessTime as PendingIcon,
  KeyboardArrowUp as OptionsIcon
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import { useAuth } from '../context/AuthContext';

// Create a context to share state between ChatModal and MessageBubble
const ChatEditContext = React.createContext();

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
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const inputRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

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

  const handleEdit = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.text);
    setNewMessage(msg.text);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleEditSend = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    
    try {
      await updateDoc(doc(db, 'chats', currentUser.uid, 'messages', editingId), {
        text: editText,
        lastEdited: new Date(),
      });
      setEditingId(null);
      setEditText('');
      setNewMessage('');
    } catch (error) {
      console.error("Error updating message:", error);
      alert("Failed to update message.");
    }
  };

  const handleDelete = async (msg) => {
    if (!window.confirm('Delete this message?')) return;
    
    try {
      await deleteDoc(doc(db, 'chats', currentUser.uid, 'messages', msg.id));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
    }
  };

  if (!isChatOpen) return null;

  return (
    <ChatEditContext.Provider value={{ handleEdit, handleDelete, editingId, editText, setEditText }}>
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
              onSubmit={editingId ? handleEditSend : handleSubmit}
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
                value={editingId ? editText : newMessage}
                onChange={e => editingId ? setEditText(e.target.value) : setNewMessage(e.target.value)}
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
                disabled={editingId ? !editText.trim() : !newMessage.trim()}
                sx={{
                  bgcolor: editingId ? 'primary.main' : 'action.disabledBackground',
                  color: 'white',
                  borderRadius: 3,
                  width: 44,
                  height: 44,
                  ml: 0,
                  boxShadow: theme => theme.shadows[1],
                  transition: 'background 0.2s',
                  '&:hover': {
                    bgcolor: editingId ? 'primary.dark' : 'action.disabledBackground',
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
    </ChatEditContext.Provider>
  );
};

// Message bubble component
const MessageBubble = ({ message }) => {
  const theme = useTheme();
  const isUser = message.sender !== 'admin';
  const hasTimestamp = message.timestamp !== null;
  const [anchorEl, setAnchorEl] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const { handleEdit, handleDelete } = useContext(ChatEditContext);
  const canEdit = isUser && message.timestamp && (Date.now() - message.timestamp.toDate().getTime() <= 60 * 60 * 1000);
  const canDelete = isUser;
  // Determine tick status
  let tick = null;
  if (isUser) {
    // Only show tick for messages sent by the user
    if (message.adminRead) {
      tick = <DoneAllIcon sx={{ fontSize: 16, color: '#2196f3', ml: 0.5, verticalAlign: 'middle' }} titleAccess="Seen" />;
    } else {
      tick = <DoneAllIcon sx={{ fontSize: 16, color: 'grey.500', ml: 0.5, verticalAlign: 'middle' }} titleAccess="Sent" />;
    }
  }
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  // Mobile: long press to open menu
  const handleTouchStart = (e) => {
    if (!canEdit && !canDelete) return;
    setLongPressTimer(setTimeout(() => setAnchorEl(e.target), 500));
  };
  const handleTouchEnd = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
  };
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1,
        maxWidth: '100%',
        position: 'relative',
        '&:hover .msg-menu-trigger': { opacity: 1 },
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!isUser && (
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
          bgcolor: isUser 
            ? 'primary.main'
            : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          color: isUser 
            ? 'white' 
            : 'text.primary',
          boxShadow: 1,
          position: 'relative',
        }}
      >
        <Typography variant="body2">{message.text}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5, gap: 0.5 }}>
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
          {isUser && (
            <IconButton
              className="msg-menu-trigger"
              size="small"
              sx={{ ml: 0.5, opacity: 0, transition: 'opacity 0.2s', p: 0.5 }}
              onClick={handleMenuOpen}
              aria-label="Message options"
            >
              <OptionsIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {canEdit && (
            <MenuItem onClick={() => { 
              handleEdit(message); 
              handleMenuClose(); 
            }}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
          )}
          {canDelete && (
            <MenuItem onClick={() => { 
              handleDelete(message); 
              handleMenuClose(); 
            }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          )}
        </Menu>
      </Box>
      {isUser && (
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