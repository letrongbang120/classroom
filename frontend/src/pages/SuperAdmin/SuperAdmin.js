import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import SuperAdminHeader from "../../components/SuperAdminHeader/SuperAdminHeader";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import { getListAdmin } from "../../actions/superAdminAction";

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
      if (JSON.parse(localStorage.getItem("userSigninClassroom")).role !== "SuperAdmin") {
        navigate('/dashboard');
        alert("You are not superadmin !!");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const [admins, setAdmins] = useState([]);
  useEffect(() => {
    if (user) {
      const getAdminList = async () => {
        const res = await getListAdmin(user.token);
        if (res) {
          setAdmins(res);
        }
      };
      getAdminList();
    }
  }, [user])
  return (
    <div>
      {/* Check role before navigate to SuperAdmin... */}
      <SuperAdminHeader />

      <div className="admin mt-5" style={{ margin: "0 50px" }}>
        <div className="row" style={{ marginBottom: "40px" }}>
          <div className="col-md-6 border-right">
            <label htmlFor="name" className="labels">
              <h4>Search admin by email</h4>
            </label>
            <input
              type="text"
              className="form-control"
              id="search-email"
              name="search-email"
              placeholder="Input email"
              required
            />
          </div>
          <div className="col-md-6 border-right">
            <label htmlFor="name" className="labels">
              <h4>Search admin by name</h4>
            </label>
            <input
              type="text"
              className="form-control"
              id="search-name"
              name="search-name"
              placeholder="Input name"
              required
            />
          </div>
        </div>

        <div style={{ margin: "10px 0" }}>
          <h4>List admin</h4>
          <Link to="/superadmin/add">
            <Button>
              <AddIcon />
              <span>Create Admin</span>
            </Button>
          </Link>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Index</th>
              <th>Email</th>
              <th>Student ID</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins &&
              admins.map((admin, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {index + 1}
                      </Link>
                    </td>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {admin.email}
                      </Link>
                    </td>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {admin.studentId}
                      </Link>
                    </td>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {admin.phone}
                      </Link>
                    </td>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {admin.age}
                      </Link>
                    </td>
                    <td>
                      <button className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
