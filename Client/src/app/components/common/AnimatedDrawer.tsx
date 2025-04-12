import React, { useState, useEffect, ReactNode, MouseEvent } from 'react';
import { 
  Box, 
  Drawer, 
  Typography, 
  Fab,
  Paper,
  IconButton,
  Divider,
  Tooltip,
  Slide,
  useTheme,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useDrawer } from '@/app/contexts/DrawerContext';

export type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited';

interface AnimatedDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSave?: () => void;
  saveDisabled?: boolean;
  initialWidth?: number;
  expandedWidth?: number;
  footerContent?: ReactNode;
  disableBackdropClick?: boolean;
  sidebarIcons?: Array<{
    id: string;
    icon: ReactNode;
    tooltip: string;
    onClick?: () => void;
  }>;
  sidebarContent?: {
    [key: string]: ReactNode;
  };
  defaultSidebarItem?: string;
}

const AnimatedDrawer: React.FC<AnimatedDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  onSave,
  saveDisabled = false,
  initialWidth = 550,
  expandedWidth = 800,
  footerContent,
  disableBackdropClick = true,
  sidebarIcons,
  sidebarContent,
  defaultSidebarItem
}) => {
  const theme = useTheme();
  const [drawerWidth, setDrawerWidth] = useState(initialWidth);
  const [drawerAnimation, setDrawerAnimation] = useState<AnimationState>('exited');
  
  // Use the drawer context
  const drawerContext = useDrawer();
  const [activeSidebarItem, setActiveSidebarItem] = useState<string | null>(null);

  // Handle drawer animation states
  useEffect(() => {
    if (open) {
      setDrawerAnimation('entering');
      setTimeout(() => {
        setDrawerAnimation('entered');
      }, 300);
    } else {
      setDrawerAnimation('exiting');
      setTimeout(() => {
        setDrawerAnimation('exited');
      }, 300);
    }
  }, [open]);

  // Set default sidebar item when drawer opens
  useEffect(() => {
    if (open) {
      // Use the provided default item, or the first icon's id if available, or from context
      const defaultItem = defaultSidebarItem || 
                          drawerContext.activeSidebarItem || 
                          (sidebarIcons && sidebarIcons.length > 0 ? sidebarIcons[0].id : null);
      
      setActiveSidebarItem(defaultItem);
      
      // Also update the context
      if (defaultItem) {
        drawerContext.setActiveSidebarItem(defaultItem);
        // Always expand drawer width when opening with a sidebar item
        setDrawerWidth(expandedWidth);
      }
    }
  }, [open, defaultSidebarItem, sidebarIcons, drawerContext, expandedWidth]);

  // Toggle drawer width between initial and expanded
  const toggleDrawerWidth = () => {
    setDrawerWidth(drawerWidth === initialWidth ? expandedWidth : initialWidth);
  };

  // Handle backdrop click - prevent closing if disableBackdropClick is true
  const handleBackdropClick = (event: MouseEvent) => {
    if (disableBackdropClick) {
      event.stopPropagation();
    } else {
      onClose();
    }
  };

  // Handle sidebar item click
  const handleSidebarItemClick = (itemId: string) => {
    // Prevent unnecessary state updates if the item is already active
    if (itemId === activeSidebarItem) {
      return;
    }
    
    // Update local state
    setActiveSidebarItem(itemId);
    
    // Update drawer context
    drawerContext.setActiveSidebarItem(itemId);
    
    // Expand drawer width when clicking a sidebar item
    setDrawerWidth(expandedWidth);
  };

  // Use provided icons directly - no defaults
  const displaySidebarIcons = sidebarIcons || [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={disableBackdropClick ? undefined : onClose}
      sx={{
        '& .MuiDrawer-paper': { 
          width: drawerWidth,
          maxWidth: '100%',
          height: '88%',
          p: 0,
          marginRight: '10px',
          borderRadius: '10px',

          marginTop: '74px', // Standard height of MUI AppBar
          top: 0,
          position: 'fixed',
          transition: 'width 0.3s ease-in-out, transform 0.4s cubic-bezier(0.2, 0, 0.2, 1) !important',
          transform: drawerAnimation === 'entering' 
            ? 'translateX(8px)' 
            : drawerAnimation === 'exiting' 
              ? 'translateX(8px)' 
              : 'translateX(0)'
        },
        '& .MuiBackdrop-root': {
          opacity: 0,
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important'
        },
        '& .MuiBackdrop-root.MuiModal-backdrop': {
          opacity: '0.5 !important'
        }
      }}
      transitionDuration={{
        enter: 400,
        exit: 300
      }}
      SlideProps={{
        easing: {
          enter: 'cubic-bezier(0.2, 0, 0.2, 1)',
          exit: 'cubic-bezier(0.4, 0, 0.6, 1)'
        },
        timeout: {
          enter: 400,
          exit: 300
        },
        style: {
          transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)'
        }
      }}
      keepMounted={false}
      // Prevent closing when clicking outside if disableBackdropClick is true
      onClick={(e) => e.stopPropagation()}
      onBackdropClick={handleBackdropClick}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        height: '100%',
        position: 'relative',
        bgcolor: 'background.paper',
      }}>
        {/* Main Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            position: 'relative',
            borderRadius: 0,
            overflow: 'hidden', // Hide overflow for the container
            flexGrow: 1,
            zIndex: 1,
            bgcolor: 'background.paper'
          }}
        >
          {/* Header Section - Fixed */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            backgroundColor: theme => theme.palette.background.paper,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            minHeight: '64px', // Fixed header height
            flexShrink: 0 // Prevent header from shrinking
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">
                {title}
              </Typography>
            </Box>
             
              <IconButton 
                onClick={onClose} 
                size="small"
                aria-label="Close"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
          </Box>
          
          {/* Content Area Section - Scrollable with Sidebar */}
          <Box sx={{ 
            flexGrow: 1,
            display: 'flex',
            height: 'calc(100% - 120px)', // Subtract header and footer heights
            position: 'relative'
          }}>
            {/* Sidebar Content Panel - Only visible when a sidebar item is active AND sidebarContent is not empty */}
            {activeSidebarItem && sidebarContent && Object.keys(sidebarContent).length > 0 && (
              <Box sx={{ 
                width: '250px',
                flexShrink: 0,
                p: 2,
                overflow: 'auto',
                backgroundColor: theme.palette.background.paper,
                borderRight: '1px solid',
                borderColor: 'divider',
              }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {displaySidebarIcons.find(icon => icon.id === activeSidebarItem)?.tooltip || 'Information'}
                  </Typography>
                </Box>
                
                {/* Custom sidebar content if provided */}
                {sidebarContent[activeSidebarItem] ? (
                  sidebarContent[activeSidebarItem]
                ) : (
                  /* Default placeholder content for each tab */
                  <>
                    {activeSidebarItem === 'info' && (
                      <Typography variant="body2">Information about this item would appear here.</Typography>
                    )}
                    {activeSidebarItem === 'attachments' && (
                      <Typography variant="body2">Attachments related to this item would be listed here.</Typography>
                    )}
                    {activeSidebarItem === 'history' && (
                      <Typography variant="body2">History of changes would be displayed here.</Typography>
                    )}
                    {activeSidebarItem === 'comments' && (
                      <Typography variant="body2">Comments and discussions would appear here.</Typography>
                    )}
                    {activeSidebarItem === 'bookmarks' && (
                      <Typography variant="body2">Bookmarked items would be listed here.</Typography>
                    )}
                    {activeSidebarItem === 'settings' && (
                      <Typography variant="body2">Settings and configuration options would be shown here.</Typography>
                    )}
                  </>
                )}
              </Box>
            )}
            
            {/* Main Content - Scrollable */}
            <Box sx={{ 
              flexGrow: 1,
              overflow: 'auto', // Only this section is scrollable
              p: 3,
              backgroundColor: theme.palette.background.paper, // Match header and footer background
            }}>
              {children}
            </Box>
            
            {/* Right Sidebar - Fixed */}
            {displaySidebarIcons.length > 0 && (
              <Box sx={{ 
                width: '60px', 
                flexShrink: 0,
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                p: 1,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderLeft: '1px solid',
                borderColor: 'divider',
                zIndex: 2
              }}>
                {displaySidebarIcons.map((item) => (
                  <Tooltip key={item.id} title={item.tooltip} placement="left">
                    <IconButton 
                      size="small"
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                          // Also update the context and expand drawer
                          drawerContext.setActiveSidebarItem(item.id);
                          setDrawerWidth(expandedWidth);
                        } else {
                          handleSidebarItemClick(item.id);
                        }
                      }}
                      sx={{ 
                        my: 0.5,
                        color: activeSidebarItem === item.id ? theme.palette.primary.main : 'inherit',
                        bgcolor: activeSidebarItem === item.id 
                          ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : theme.palette.primary.light + '33')
                          : 'transparent',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.1)' 
                            : theme.palette.primary.light + '22'
                        },
                        transition: 'all 0.2s ease-in-out',
                        borderRadius: '8px',
                        p: 1
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            )}
          </Box>
          
          {/* Footer Section - Fixed */}
          <Box sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
            minHeight: '56px', // Fixed footer height
            flexShrink: 0, // Prevent footer from shrinking
            position: 'sticky',
            bottom: 0,
            zIndex: 1000
          }}>
            <Box>
              {footerContent}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onClose}
                size="small"
              >
                Cancel
              </Button>
              {onSave && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={onSave}
                  disabled={saveDisabled}
                  size="small"
                >
                  Save
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Drawer>
  );
};

export default AnimatedDrawer;
