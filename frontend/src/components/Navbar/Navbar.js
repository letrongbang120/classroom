import { IconButton, MenuItem, Menu } from "@material-ui/core";
import { Add, Apps, Menu as MenuIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Button from "@mui/material/Button";

import { createDialogAtom, joinDialogAtom } from "../../utils/atoms";
import CreateClass from "../CreateClass/CreateClass";
import JoinClass from "../JoinClass/JoinClass";
import "./Navbar.css";
import { useNavigate } from "react-router";
import { signout } from "../../actions/userActions";
import { Link } from 'react-router-dom';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [createOpened, setCreateOpened] = useRecoilState(createDialogAtom);
  const [joinOpened, setJoinOpened] = useRecoilState(joinDialogAtom);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [user, setUser] = useState({});
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      const user = JSON.parse(localStorage.getItem("userSigninClassroom"));
      setUser(user);
    }
  }, []);

  const navigate = useNavigate();
  const profileClickHandler = () => {
    navigate(`/u/${user.accountId}`);
  }

  const logOutHandler = () => {
    signout();
    navigate("/login");
  }

  return (
    <>
      <CreateClass />
      <JoinClass />
      <nav className="navbar">
        <div className="navbar__left">
          <Link to="/dashboard">
            <IconButton>
              <MenuIcon />
            </IconButton>
            <img
              src="https://1000logos.net/wp-content/uploads/2021/05/Google-logo.png"
              alt="Google Logo"
              className="navbar__logo"
            />{" "}
            <span className="classroom" style={{ display: "inline-block" }}>Classroom</span>
          </Link>
        </div>
        <div className="navbar__right">
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Add />
          </IconButton>
          <IconButton>
            <Apps />
          </IconButton>

          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  {user.username}
                </Button>
                <Menu {...bindMenu(popupState)} style={{ marginTop: "40px" }}>
                  <MenuItem onClick={() => {
                    popupState.close();
                    profileClickHandler();
                  }}>Profile</MenuItem>
                  <MenuItem onClick={() => {
                    popupState.close();
                    logOutHandler();
                  }}>Logout</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ marginTop: "40px" }}
          >
            <MenuItem
              onClick={() => {
                setCreateOpened(true);
                handleClose();
              }}
            >
              Create Class
            </MenuItem>
            <MenuItem
              onClick={() => {
                setJoinOpened(true);
                handleClose();
              }}
            >
              Join Class
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
