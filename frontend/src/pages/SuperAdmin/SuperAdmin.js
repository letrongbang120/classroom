import React from "react";
import { Table } from "react-bootstrap";
import SuperAdminHeader from "../../components/SuperAdminHeader/SuperAdminHeader";
import SortIcon from "@mui/icons-material/Sort";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

export default function SuperAdmin() {
  const dummyAdmins = [
    {
      fullname: "Danh Hoàng",
      email: "danhhoang@gmail.com",
      createdTime: "13/9/2021",
    },
    {
      fullname: "Danh Hoàng123",
      email: "danhhoang123@gmail.com",
      createdTime: "15/9/2021",
    },
    {
      fullname: "Danh Hoàng16",
      email: "danhhoang16@gmail.com",
      createdTime: "18/9/2021",
    },
  ];
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
              <th>Fullname</th>
              <th>Email</th>
              <th>
                <div>
                  Created Time
                  <Button>
                    <SortIcon />
                  </Button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyAdmins &&
              dummyAdmins.map((admin, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {index + 1}
                      </Link>
                    </td>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {admin.fullname}
                      </Link>
                    </td>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {admin.email}
                      </Link>
                    </td>
                    <td>
                      <Link to="/superadmin/details" style={{ color: "black" }}>
                        {admin.createdTime}
                      </Link>
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
