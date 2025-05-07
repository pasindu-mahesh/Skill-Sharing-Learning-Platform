// src/components/Navbar.jsx
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, useMediaQuery, InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, AccountCircle, Search } from '@mui/icons-material';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Learning Plans', path: '/learning-plans' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item, index) => (
          <ListItem button key={index} onClick={() => navigate(item.path)}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" className="appbar">
        <Toolbar>
          <Typography className="brand-title" >
            Photogram
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ marginLeft: 'auto' }}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              <div className="nav-buttons">
                {navItems.map((item, index) => (
                  <Button key={index} color="inherit" onClick={() => navigate(item.path)}>
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="search-bar">
                <div className="search-icon-wrapper">
                  <Search />
                </div>
                <InputBase
                  placeholder="Search…"
                  className="search-input"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>

              <IconButton className="profile-icon">
                <AccountCircle />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ '& .MuiDrawer-paper': { backgroundColor: '#B195EA', color: '#411D87' } }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
