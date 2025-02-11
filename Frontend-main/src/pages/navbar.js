import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkIcon from '@mui/icons-material/Work';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false); // State to manage dropdown
  const [staffOpen, setStaffOpen] = useState(false); // State to manage Staff dropdown
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const usenav = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleServices = () => {
    setServicesOpen(!servicesOpen);
  };

  const toggleStaff = () => {
    setStaffOpen(!staffOpen);
  };

  const logouthandler = () => {
    localStorage.clear();
    usenav('/');
    window.location.reload();
  };

  const handleSubItemClick = (link) => {
    setServicesOpen(false); // Close the dropdown
    setStaffOpen(false); // Close the Staff dropdown
    usenav(link);
  };

  const loggedName = localStorage.getItem('name');

  const menuItemsOwner = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/ownerhome' },
    { text: 'Students', icon: <PeopleIcon />, link: '/students' },
    { 
      text: 'Staff',
      icon: <AdminPanelSettingsIcon />,
      children: [
        { text: 'Admins', link: '/admins' },
        { text: 'Trainers', link: '/trainer' },
      ],
    },
    {
      text: 'Daily Updates',
      icon: <AssignmentIcon />,
      children: [
        { text: 'Enquires', link: '/enquires' },
        { text: 'Followups', link: '/followups' },
      ],
    },
    { text: 'Internship', icon: <WorkIcon />, link: '/internsdashboard' },
   
    { text: 'Logout', icon: <ExitToAppIcon />, onClick: logouthandler },
  ];

  const menuItemsAdmin = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/adminhome' },
    { text: 'Students', icon: <PeopleIcon />, link: '/students' },
    { text: 'Trainers', icon: <SchoolIcon />, link: '/trainer' },
    { text: 'Courses', icon: <MenuBookIcon />, link: '/courses' },
    { text: 'Logout', icon: <ExitToAppIcon />, onClick: logouthandler },
  ];

  const role = localStorage.getItem('role');
  const menuItems = role === 'owner' ? menuItemsOwner : (role === 'admin' ? menuItemsAdmin : []);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#FAFBEC', color: '#333' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {(role === 'owner' || role === 'admin') && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: 'block', md: 'none' } }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and logged-in user name */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src='hippo-cloud-technlogies-logo-3.png' alt='Hippocloud' height='50px' />
            {/* Displaying the logged-in user's name */}
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 600,
                fontSize: '14px',
                marginTop: '4px',
                color: '#333', // You can adjust this to fit your theme
              }}
            >
             
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) =>
                item.children ? (
                  <Box key={item.text} sx={{ position: 'relative' }}>
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mr: 2,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: '#333',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'rgb(54, 67, 209)',
                          textDecoration: 'underline red',
                        },
                      }}
                      onClick={item.text === 'Staff' ? toggleStaff : toggleServices}
                    >
                      {item.icon}
                      <span style={{ marginLeft: '8px' }}>{item.text}</span>
                      {(item.text === 'Staff' ? staffOpen : servicesOpen) ? <ExpandLess /> : <ExpandMore />}
                    </Typography>
                    <Collapse in={item.text === 'Staff' ? staffOpen : servicesOpen} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          width: '100%',
                          bgcolor: 'red',
                          boxShadow: 3,
                          borderRadius: '4px',
                          overflow: 'hidden',
                          zIndex: -1,
                        }}
                      >
                        {item.children.map((subItem) => (
                          <Typography
                            key={subItem.text}
                            onClick={() => handleSubItemClick(subItem.link)}
                            sx={{
                              padding: '8px 16px',
                              cursor: 'pointer',
                              bgcolor: '#f9f9f9',
                              '&:hover': {
                                bgcolor: 'rgb(54, 67, 209)',
                                color: 'white',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {subItem.text}
                          </Typography>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                ) : (
                  <Link to={item.link} key={item.text} style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mr: .5,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: '#333',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'rgb(54, 67, 209)',
                          textDecoration: 'underline red',
                        },
                      }}
                      onClick={item.onClick}
                    >
                      {item.icon}
                      <span style={{ marginLeft: '8px' }}>{item.text}</span>
                    </Typography>
                  </Link>
                )
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <List>
          {menuItems.map((item) =>
            item.children ? (
              <React.Fragment key={item.text}>
                <ListItem button onClick={item.text === 'Staff' ? toggleStaff : toggleServices}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {(item.text === 'Staff' ? staffOpen : servicesOpen) ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={item.text === 'Staff' ? staffOpen : servicesOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((subItem) => (
                      <ListItem
                        key={subItem.text}
                        button
                        sx={{ pl: 4 }}
                        onClick={() => handleSubItemClick(subItem.link)}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <Link to={item.link} key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem button>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            )
          )}
        </List>
      </Drawer>
    </>
  );
}
