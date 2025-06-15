import React, { useEffect } from 'react';
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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';

const AdminChatUserList = () => {
  const { userChats, selectedUser, setSelectedUser, loadUserChats, markMessagesAsAdminRead } = useChat();

  // When a user is selected, mark their messages as read
  useEffect(() => {
    if (selectedUser) {
      markMessagesAsAdminRead(selectedUser);
    }
  }, [selectedUser, markMessagesAsAdminRead]);

  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
  };

  const handleRefresh = () => {
    loadUserChats(true);
  };

  if (!userChats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
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
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          Active Conversations ({userChats.length})
        </Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          size="small" 
          onClick={handleRefresh}
          sx={{ minWidth: 0 }}
        >
          Refresh
        </Button>
      </Box>
      
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        {userChats.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            p: 3,
            textAlign: 'center'
          }}>
            <Typography color="text.secondary">
              No active conversations yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', p: 0 }}>
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
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      badgeContent={chat.unreadCount}
                      invisible={chat.unreadCount === 0}
                      overlap="circular"
                    >
                      <Avatar sx={{ bgcolor: chat.unreadCount > 0 ? 'primary.main' : 'grey.400' }}>
                        <PersonIcon />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body1" 
                        fontWeight={chat.unreadCount > 0 ? 700 : 400}
                        noWrap
                      >
                        {chat.name}
                      </Typography>
                    }
                    secondary={
                      chat.latestMessage ? (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: chat.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                            fontWeight: chat.unreadCount > 0 ? 500 : 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {chat.latestMessage.text}
                        </Typography>
                      ) : (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontStyle: 'italic'
                          }}
                        >
                          No messages yet
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                {index < userChats.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default AdminChatUserList;
