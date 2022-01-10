import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from '@mui/icons-material/Logout';

export default function AdminHeader() {
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/admin/users" style={{color:'black'}}>
            <h2>Dashboard</h2>
        </Link>
      </div>
      <div>
          <Link to="/admin/users" style={{color:'black', fontWeight: 'bold', marginRight:'50px'}}>Manage User Accounts</Link>
          <Link to="/admin/classes" style={{color:'black', fontWeight: 'bold'}}>Manage Classes</Link>
      </div>
      <div className="navbar__right">
        <Button>
          <LogoutIcon/>
        </Button>
      </div>
    </nav>
  );
}
