import React, { useState } from "react";
import { Table } from "react-bootstrap";
import SortIcon from "@mui/icons-material/Sort";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getListClass } from "../../actions/adminActions";

export default function Classes() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
      if (JSON.parse(localStorage.getItem("userSigninClassroom")).role !== "SuperAdmin" &&
        JSON.parse(localStorage.getItem("userSigninClassroom")).role !== "Admin") {
        navigate('/dashboard');
        alert("You are not superadmin !!");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    if (user) {
      const getClass = async () => {
        const res = await getListClass(user.token);
        if (res) {
          setClasses(res);
        }
      }
      getClass();
    }

  }, [navigate, user]);

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
                  Topic
                  <Button>
                    <SortIcon />
                  </Button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {classes &&
              classes.map((cls, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Link to={`/admin/class/${cls.classId}`} style={{ color: "black" }}>
                        {index + 1}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admin/class/${cls.classId}`} style={{ color: "black" }}>
                        {cls.name}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admin/class/${cls.classId}`} style={{ color: "black" }}>
                        {cls.theme}
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
