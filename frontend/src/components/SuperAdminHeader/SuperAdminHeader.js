import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from '@mui/icons-material/Logout';
import { signout } from "../../actions/userActions";

export default function SuperAdminHeader() {
  const navigate = useNavigate();
  const logOutHandler = async () => {
    signout()
    navigate('/login');
  }
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/superadmin" style={{ color: 'black' }}>
          <h3>Super Dashboard</h3>
        </Link>
      </div>
      <div className="navbar__right">
        <Button onClick={logOutHandler}>
          <LogoutIcon />
        </Button>
      </div>
    </nav>
  );
}
