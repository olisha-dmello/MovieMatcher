import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

import ProfileIcon from '@mui/icons-material/Person';
import FriendsIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import DiscoverIcon from '@mui/icons-material/LiveTv';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box'

const Navbar = () => {
  const location = useLocation(); // Get the current path

  const iconColor = (path) => {
    // return 
    if (location.pathname === path)
      return (theme) => theme.palette.navbar.icon_active;
    return (theme) => theme.palette.navbar.icon_inactive;
  }

  const background = (theme) => `linear-gradient(90deg, ${theme.palette.navbar.background1}, ${theme.palette.navbar.background2})`;

  return (
    <nav>
      <Box sx={{ background: background }} className='navbar'>

        <div className="navbar-logo">
          <Link to="/">
            <Box sx={{ color: (theme) => theme.palette.text.main }} >
              MOVIE MATCHER
            </Box>
          </Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/profile">
              <Tooltip title="Profile">
                <ProfileIcon className={`icon ${location.pathname === '/profile' ? 'active' : ''}`} sx={{ color: iconColor('/profile') }} />
              </Tooltip>
            </Link>
          </li>

          <li>
            <Link to="/friends">
              <Tooltip title="Friends">
                <FriendsIcon className={`icon ${location.pathname === '/friends' ? 'active' : ''}`} sx={{ color: iconColor('/friends') }} />
              </Tooltip>
            </Link>
          </li>

          <li>
            <Link to="/discover">
              <Tooltip title="Discover">
                <DiscoverIcon className={`icon ${location.pathname === '/discover' ? 'active' : ''}`} sx={{ color: iconColor('/discover') }} />
              </Tooltip>
            </Link>
          </li>

          <li>
            <Link to="/groups">
              <Tooltip title="Groups">
                <GroupsIcon className={`icon ${location.pathname === '/groups' ? 'active' : ''}`} sx={{ color: iconColor('/groups') }} />
              </Tooltip>
            </Link>
          </li>

          <li>
            <Link to="/appsettings">
              <Tooltip title="Settings">
                <SettingsIcon className={`icon ${location.pathname === '/appsettings' ? 'active' : ''}`} sx={{ color: iconColor('/appsettings') }} />
              </Tooltip>
            </Link>
          </li>
        </ul>
      </Box>
    </nav>
  );
};

export default Navbar;
