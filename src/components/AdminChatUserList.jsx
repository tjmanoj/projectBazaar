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
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Person as PersonIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
  Chat as ChatIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import { fetchAllUsers } from '../services/userService';
import { useTheme } from '@mui/material/styles';

const AdminChatUserList = () => {
  const theme = useTheme();
  const { 
    userChats, 
    selectedUser, 
    setSelectedUser, 
    loadUserChats, 
    markMessagesAsAdminRead,
    adminLoading,
    adminError
  } = useChat();
  
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0 = Active Chats, 1 = All Users

  // Fetch all users from Firestore
  const loadAllUsers = async (forceRefresh = false) => {
    if (isLoadingUsers && !forceRefresh) return;
    
    setIsLoadingUsers(true);
    setUsersError(null);
    
    try {
      const usersData = await fetchAllUsers();
      
      // Add hasChat flag based on userChats
      const usersWithChatFlag = usersData.map(user => ({
        ...user,
        hasChat: userChats ? userChats.some(chat => chat.id === user.uid) : false
      }));
      
      setAllUsers(usersWithChatFlag);
      console.log(`[AdminChatUserList] Loaded ${usersWithChatFlag.length} users from Firestore`);
    } catch (error) {
      console.error("[AdminChatUserList] Error loading users:", error);
      setUsersError(error.message || "Failed to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Load all users when component mounts
  useEffect(() => {
    loadAllUsers();
    // Reload all users when userChats changes to update hasChat flag
    if (userChats && userChats.length > 0) {
      loadAllUsers();
    }
  }, [userChats]);

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
      console.log("[AdminChatUserList] Selecting user:", userId);
      setSelectedUser(userId);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      
      // Refresh based on active tab
      if (tabValue === 0) {
        loadUserChats(true)
          .then(() => {
            console.log("[AdminChatUserList] User chats refreshed successfully");
          })
          .catch(error => {
            console.error("[AdminChatUserList] Error refreshing user chats:", error);
          })
          .finally(() => {
            setTimeout(() => {
              setIsRefreshing(false);
            }, 1000);
          });
      } else {
        loadAllUsers(true)
          .finally(() => {
            setTimeout(() => {
              setIsRefreshing(false);
            }, 1000);
          });
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle initial loading and error states more explicitly
  if ((adminLoading && (!userChats || userChats.length === 0)) && tabValue === 0) { 
    return (
      <Paper elevation={1} sx={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2, p: 2 }}>
        <Box sx={{textAlign: 'center'}}>
            <CircularProgress />
            <Typography sx={{mt: 1, color: 'text.secondary'}}>Loading conversations...</Typography>
        </Box>
      </Paper>
    );
  }

  if (adminError && tabValue === 0) {
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

  if (isLoadingUsers && tabValue === 1 && allUsers.length === 0) {
    return (
      <Paper elevation={1} sx={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2, p: 2 }}>
        <Box sx={{textAlign: 'center'}}>
            <CircularProgress />
            <Typography sx={{mt: 1, color: 'text.secondary'}}>Loading users...</Typography>
        </Box>
      </Paper>
    );
  }

  if (usersError && tabValue === 1) {
    return (
      <Paper elevation={1} sx={{ height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 2, p: 3, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
        <Typography color="error" variant="h6" gutterBottom>Error Loading Users</Typography>
        <Typography variant="body1" color="text.secondary" sx={{mb: 2}}>{usersError}</Typography>
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
          {tabValue === 0 ? 
            `Active Conversations (${userChats ? userChats.length : 0})` : 
            `All Users (${allUsers ? allUsers.length : 0})`
          }
        </Typography>
        <Button 
          startIcon={isRefreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          size="small" 
          onClick={handleRefresh}
          disabled={isRefreshing || (tabValue === 0 ? adminLoading : isLoadingUsers)}
          sx={{ minWidth: 'auto', px: 1 }}
        >
          {isRefreshing ? '' : 'Refresh'}
        </Button>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          minHeight: '48px',
          '& .MuiTab-root': {
            minHeight: '48px',
          }
        }}
      >
        <Tab 
          icon={<ChatIcon sx={{ fontSize: 18 }} />} 
          label="Active Chats" 
          iconPosition="start"
          sx={{ 
            fontSize: '0.8rem',
            py: 1
          }}
        />
        <Tab 
          icon={<EmailIcon sx={{ fontSize: 18 }} />} 
          label="All Users" 
          iconPosition="start"
          sx={{ 
            fontSize: '0.8rem',
            py: 1
          }}
        />
      </Tabs>
      
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        {/* Active Chats Tab */}
        {tabValue === 0 && (
          <>
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
                          variant="dot"
                          badgeContent={chat.unreadCount > 0 ? ' ' : 0}
                          invisible={!(chat.unreadCount > 0)}
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
                            {chat.email || chat.name || 'User ID: ' + chat.id.substring(0,6)}
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
          </>
        )}

        {/* All Users Tab */}
        {tabValue === 1 && (
          <>
            {allUsers && allUsers.length === 0 && !isLoadingUsers ? (
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
                  No Users Found
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  There are no registered users in the system.
                </Typography>
              </Box>
            ) : (
              allUsers && <List sx={{ width: '100%', p: 0 }}>
                {allUsers.map((user, index) => (
                  <React.Fragment key={user.uid}>
                    <ListItem 
                      button 
                      selected={selectedUser === user.uid}
                      onClick={() => handleSelectUser(user.uid)}
                      sx={{ 
                        px: 2, 
                        py: 1.5,
                        bgcolor: selectedUser === user.uid ? 'action.selected' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        borderLeft: selectedUser === user.uid ? (theme) => `3px solid ${theme.palette.primary.main}` : 'none',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={user.photoURL} 
                          alt={user.displayName || user.email}
                          sx={{ 
                            bgcolor: user.hasChat ? 'primary.light' : 'grey.300', 
                            color: user.hasChat ? 'primary.contrastText' : 'text.secondary' 
                          }}
                        >
                          {user.displayName ? user.displayName[0].toUpperCase() : <PersonIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Typography 
                            variant="body1" 
                            fontWeight={selectedUser === user.uid ? 'medium' : 'normal'}
                            color={selectedUser === user.uid ? 'text.primary' : 'text.secondary'}
                            noWrap
                          >
                            {user.displayName || user.email || 'User ID: ' + user.uid.substring(0,6)}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.email || 'No email available'}
                          </Typography>
                        }
                      />
                      {user.hasChat && (
                        <ChatIcon color="primary" fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                      )}
                    </ListItem>
                    {index < allUsers.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default AdminChatUserList;
