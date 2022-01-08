import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from '@mui/icons-material/Logout';

export default function SuperAdminHeader() {
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/superadmin" style={{color:'black'}}>
            <h3>Dashboard</h3>
        </Link>
      </div>
      <div className="navbar__right">
        <Button>
          <LogoutIcon/>
        </Button>
      </div>
    </nav>
  );
}
