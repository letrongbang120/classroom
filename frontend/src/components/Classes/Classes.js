import React from "react";
import { Table } from "react-bootstrap";
import SortIcon from "@mui/icons-material/Sort";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function Classes() {
  const dummyClasses = [
    {
      className: "Xác Suất Thống Kê",
      createdTime: "13/9/2021",
    },
    {
      className: "Web",
      createdTime: "15/9/2021",
    },
    {
      className: "Web NC",
      createdTime: "18/9/2021",
    },
  ];
  return (
    <div>
      <div className="admin mt-5" style={{ margin: "0 50px" }}>
        <div className="row" style={{ marginBottom: "40px" }}>
          <div className="col-md-12 border-right">
            <label htmlFor="name" className="labels">
              <h4>Search class by name</h4>
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
          <h4>List classes</h4>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Index</th>
              <th>Class Name</th>
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
            {dummyClasses &&
              dummyClasses.map((cls, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Link to="/admin/class/details" style={{ color: "black" }}>
                        {index + 1}
                      </Link>
                    </td>
                    <td>
                      <Link to="/admin/class/details" style={{ color: "black" }}>
                        {cls.className}
                      </Link>
                    </td>
                    <td>
                      <Link to="/admin/user/details" style={{ color: "black" }}>
                        {cls.createdTime}
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
