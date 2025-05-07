import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img
            src="/logo.png"
            alt="Photogram"
            style={{ height: 32, marginRight: 8 }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              background: 'linear-gradient(to right, #B195EA, #411D87)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            Photogram
          </span>
        </Link>

        {/* Desktop Navigation */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end',
            gap: 2
          }}
        >
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              color: '#411D87',
              backgroundColor: isActive('/') ? 'rgba(177, 149, 234, 0.1)' : 'transparent'
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/create-post"
            startIcon={<AddIcon />}
            sx={{
              color: '#411D87',
              backgroundColor: isActive('/create-post') ? 'rgba(177, 149, 234, 0.1)' : 'transparent'
            }}
          >
            Create Post
          </Button>
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={() => setIsMenuOpen(!isMenuOpen)} edge="end">
            <MenuIcon sx={{ color: '#411D87' }} />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Menu Items */}
      {isMenuOpen && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            bgcolor: 'white',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1,
            boxShadow: 3
          }}
        >
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            onClick={() => setIsMenuOpen(false)}
            sx={{
              color: '#411D87',
              justifyContent: 'flex-start',
              px: 2,
              py: 1.5,
              backgroundColor: isActive('/') ? '#f1f5f9' : 'transparent'
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/create-post"
            startIcon={<AddIcon />}
            onClick={() => setIsMenuOpen(false)}
            sx={{
              color: '#411D87',
              justifyContent: 'flex-start',
              px: 2,
              py: 1.5,
              backgroundColor: isActive('/create-post') ? '#f1f5f9' : 'transparent'
            }}
          >
            Create Post
          </Button>
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
