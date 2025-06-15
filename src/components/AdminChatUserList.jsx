import React, { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Divider, 
  Box, 
  Badge,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Person as PersonIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon // Added for error display
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';

const AdminChatUserList = () => {
  const { 
    userChats, 
    selectedUser, 
    setSelectedUser, 
    loadUserChats, 
    markMessagesAsAdminRead,
    adminLoading, // Added from context
    adminError    // Added from context
  } = useChat();

  // When a user is selected, mark their messages as read
  useEffect(() => {
    if (selectedUser) {
      // Add a small delay to prevent multiple rapid calls
      const timeoutId = setTimeout(() => {
        // Ensure markMessagesAsAdminRead is called with the correct selectedUser
        // and that it's only called if selectedUser is not null/undefined.
        if (selectedUser) { 
            console.log(`[AdminChatUserList] useEffect: selectedUser changed to ${selectedUser}, calling markMessagesAsAdminRead.`);
            markMessagesAsAdminRead(selectedUser);
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedUser, markMessagesAsAdminRead]);

  const handleSelectUser = (userId) => {
    // Prevent re-selecting the same user unnecessarily
    if (userId !== selectedUser) {
      console.log("Selecting user:", userId);
      setSelectedUser(userId);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      loadUserChats(true) // Assuming loadUserChats can take a 'force' flag or similar
        .then(() => {
          console.log("User chats refreshed successfully");
        })
        .catch(error => {
          console.error("Error refreshing user chats:", error);
        })
        .finally(() => {
          // Prevent multiple rapid refreshes
          setTimeout(() => {
            setIsRefreshing(false);
          }, 1000);
        });
    }
  };

  // Handle initial loading and error states more explicitly
  if (adminLoading && (!userChats || userChats.length === 0)) { 
    return (
      <Paper elevation={1} sx={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2, p: 2 }}>
        <Box sx={{textAlign: 'center'}}>
            <CircularProgress />
            <Typography sx={{mt: 1, color: 'text.secondary'}}>Loading conversations...</Typography>
        </Box>
      </Paper>
    );
  }

  if (adminError) {
    return (
      <Paper elevation={1} sx={{ height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 2, p: 3, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
        <Typography color="error" variant="h6" gutterBottom>Loading Error</Typography>
        <Typography variant="body1" color="text.secondary" sx={{mb: 2}}>{adminError}</Typography>
        <Button 
          startIcon={isRefreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          size="small" 
          variant="outlined"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Retrying...' : 'Retry'}
        </Button>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        height: '500px', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2
      }}
    >
      <Box sx={{ 
        p: 1.5, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'medium' }}>
          Conversations ({userChats ? userChats.length : 0})
        </Typography>
        <Button 
          startIcon={isRefreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          size="small" 
          onClick={handleRefresh}
          disabled={isRefreshing || adminLoading} // Disable if globally loading too
          sx={{ minWidth: 'auto', px: 1 }}
        >
          {isRefreshing ? '' : 'Refresh'}
        </Button>
      </Box>
      
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        {userChats && userChats.length === 0 && !adminLoading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            p: 3,
            textAlign: 'center'
          }}>
            <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Chats Yet
            </Typography>
            <Typography color="text.secondary" variant="body2">
              When users start a conversation, it will appear here.
            </Typography>
          </Box>
        ) : (
          userChats && <List sx={{ width: '100%', p: 0 }}>
            {userChats.map((chat, index) => (
              <React.Fragment key={chat.id}>
                <ListItem 
                  button 
                  selected={selectedUser === chat.id}
                  onClick={() => handleSelectUser(chat.id)}
                  sx={{ 
                    px: 2, 
                    py: 1.5,
                    bgcolor: selectedUser === chat.id ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    borderLeft: selectedUser === chat.id ? (theme) => `3px solid ${theme.palette.primary.main}` : 'none',
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      variant="dot" // Using dot for a cleaner look, count can be shown elsewhere or with number
                      badgeContent={chat.unreadCount > 0 ? ' ' : 0} // Ensure badge is visible if unreadCount > 0
                      invisible={!(chat.unreadCount > 0)} // Hide if no unread
                      overlap="circular"
                    >
                      <Avatar sx={{ bgcolor: chat.unreadCount > 0 ? 'primary.light' : 'grey.300', color: chat.unreadCount > 0 ? 'primary.contrastText' : 'text.secondary' }}>
                        <PersonIcon />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body1" 
                        fontWeight={selectedUser === chat.id || chat.unreadCount > 0 ? 'medium' : 'normal'}
                        color={selectedUser === chat.id || chat.unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                        noWrap
                      >
                        {chat.name || 'User ID: ' + chat.id}
                      </Typography>
                    }
                    secondary={
                      chat.latestMessage ? (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: chat.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                            fontWeight: chat.unreadCount > 0 ? 'medium' : 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontStyle: chat.latestMessage.sender === 'admin' ? 'italic' : 'normal',
                          }}
                        >
                          {chat.latestMessage.sender === 'admin' && 'You: '}
                          {chat.latestMessage.text}
                        </Typography>
                      ) : (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.disabled',
                            fontStyle: 'italic'
                          }}
                        >
                          No messages yet
                        </Typography>
                      )
                    }
                  />
                  {chat.unreadCount > 0 && (
                    <Typography variant="caption" color="error" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {chat.unreadCount}
                    </Typography>
                  )}
                </ListItem>
                {index < userChats.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default AdminChatUserList;
