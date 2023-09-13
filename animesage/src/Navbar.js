import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; 

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button component={RouterLink} to="/" color="inherit">
            Anime Sage
          </Button>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
