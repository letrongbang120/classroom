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

  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      const user = JSON.parse(localStorage.getItem("userSigninClassroom"));
      setUserName(user.username);
    }
  }, []);

  return (
    <>
      <CreateClass />
      <JoinClass />
      <nav className="navbar">
        <div className="navbar__left">
          <IconButton>
            <MenuIcon />
          </IconButton>
          <img
            src="https://1000logos.net/wp-content/uploads/2021/05/Google-logo.png"
            alt="Google Logo"
            className="navbar__logo"
          />{" "}
          <span className="classroom">Classroom</span>
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
                  {userName}
                </Button>
                <Menu {...bindMenu(popupState)} style={{ marginTop: "40px"}}>
                  <MenuItem onClick={popupState.close}>Profile</MenuItem>
                  <MenuItem onClick={popupState.close}>Logout</MenuItem>
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
            style={{marginTop:'40px'}}
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
