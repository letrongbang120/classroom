import React from "react";
import { Table } from "react-bootstrap";
import SortIcon from "@mui/icons-material/Sort";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function Users() {
  const dummyUsers = [
    {
      fullname: "Danh Hoàng",
      email: "danhhoang@gmail.com",
      createdTime: "13/9/2021",
      ban: true
    },
    {
      fullname: "Danh Hoàng123",
      email: "danhhoang123@gmail.com",
      createdTime: "15/9/2021",
      ban: false
    },
    {
      fullname: "Danh Hoàng16",
      email: "danhhoang16@gmail.com",
      createdTime: "18/9/2021",
      ban: true
    },
  ];
  return (
    <div>
      <div className="admin mt-5" style={{ margin: "0 50px" }}>
        <div className="row" style={{ marginBottom: "40px" }}>
          <div className="col-md-6 border-right">
            <label htmlFor="name" className="labels">
              <h4>Search user account by email</h4>
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
              <h4>Search user account by name</h4>
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
          <h4>List user acounts</h4>
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
              <th>Ban/Lock</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers &&
              dummyUsers.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Link to="/admin/user/details" style={{ color: "black" }}>
                        {index + 1}
                      </Link>
                    </td>
                    <td>
                      <Link to="/admin/user/details" style={{ color: "black" }}>
                        {user.fullname}
                      </Link>
                    </td>
                    <td>
                      <Link to="/admin/user/details" style={{ color: "black" }}>
                        {user.email}
                      </Link>
                    </td>
                    <td>
                      <Link to="/admin/user/details" style={{ color: "black" }}>
                        {user.createdTime}
                      </Link>
                    </td>
                    <td>
                        {user.ban ? 
                          <Button style={{color:"blue"}}>Unban</Button>
                          : <Button style={{color:"red"}}>Ban</Button>
                        }
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
