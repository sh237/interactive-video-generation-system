import React ,{ useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { onAuthStateChanged,signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig.js";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    position: 'fixed',
    width: '100%',
    height: '10%',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleClick} // メニューを表示するためのクリックハンドラを追加
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Short Video Generator
          </Typography>
          <p color="inherit">
            <p
              style={{
                fontSize: '13px',
                paddingTop: '10%',
                fontWeight: 'bold',
              }}
            >
              user:{props.user?.email}
            </p>
          </p>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>プロフィール</MenuItem>
        <MenuItem onClick={handleClose}>設定</MenuItem>
        <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
      </Menu>
    </div>
  );
}