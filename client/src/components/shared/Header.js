import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar';
import RadioIcon from '@material-ui/icons/RadioTwoTone';
import FaceIcon from '@material-ui/icons/FaceTwoTone';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';

import Signout from '../auth/Signout';


const Header = ({currentUser}) => {
  return (
    <AppBar position='static'>
      <Toolbar style={{
        display: 'flex',
        justifyContent:'space-between'
      }}>
        {/* Title and Logo */}
        <Link to='/' style={{
          display:'flex'
        }}>
          <RadioIcon style={{
            color: '#fff',
            marginRight:20
          }} />
          <Typography noWrap style={{
            color:'#fff'
          }}>
             React Tracks
          </Typography>
        </Link>

        {/* Auth User Info */}
        {currentUser && (
          <Link to={`/profiles/${currentUser.id}`} style={{
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            justifyContent:'space-around'
          }}>
            <FaceIcon style={{
              marginRight:20
            }} />
            <Typography noWrap>
             {currentUser.username}
            </Typography>
          </Link>
        )}
        
        {/* Signout Button */}

       <Signout />
      </Toolbar>
    </AppBar>
  )
}

export default Header;
