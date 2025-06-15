import React from 'react';
import { Box, Badge, Fab, Tooltip, useTheme, keyframes } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { useChat } from '../context/ChatContext';

// Create a pulse animation for the button when there are unread messages
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const ChatButton = () => {
  const { toggleChat, isChatOpen, unreadCount } = useChat();
  const theme = useTheme();
  
  // Determine if we should animate the button
  const hasUnread = unreadCount > 0;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Tooltip 
        title="Custom Project Request" 
        arrow 
        placement="left"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'primary.main',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 500,
              padding: '8px 12px',
              boxShadow: theme.shadows[3],
              borderRadius: '8px',
            }
          },
          arrow: {
            sx: {
              color: 'primary.main',
            }
          }
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          overlap="circular"
          invisible={unreadCount === 0}
        >
          <Fab
            color="primary"
            aria-label="chat"
            onClick={toggleChat}
            size="large"
            sx={{
              transform: isChatOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.2s ease-in-out',
              boxShadow: theme.shadows[6],
              '&:hover': {
                boxShadow: theme.shadows[10],
                bgcolor: 'primary.dark',
              },
              animation: hasUnread ? `${pulse} 2s infinite` : 'none',
              width: 60,
              height: 60,
            }}
          >
            <ChatIcon fontSize="medium" />
          </Fab>
        </Badge>
      </Tooltip>
    </Box>
  );
};

export default ChatButton;
