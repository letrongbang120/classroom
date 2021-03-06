import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getListUser } from "../../actions/adminActions";
import { banUser } from "../../actions/userActions";

export default function Users() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setAdmin(JSON.parse(localStorage.getItem("userSigninClassroom")));
      if (
        JSON.parse(localStorage.getItem("userSigninClassroom")).role !== "SuperAdmin" &&
        JSON.parse(localStorage.getItem("userSigninClassroom")).role !== "Admin"
      ) {
        navigate('/dashboard');
        alert("You are not Admin !!");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const res = await getListUser();
      if (res) {
        setUsers(res);
      }
    }
    getUsers();
  }, []);

  const banUserHandler = async (user) => {
    const res = await banUser(user.accountId);
    if (res) {
      alert("Success")
    }
    else {
      alert("Fail");
    }
  }
  console.log(users);
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
              <th>Phone</th>
              <th>Age</th>
              <th>Ban/Lock</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Link to={`/admin/user/${user.accountId}`} style={{ color: "black" }}>
                        {index + 1}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admin/user/${user.accountId}`} style={{ color: "black" }}>
                        {user.username}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admin/user/${user.accountId}`} style={{ color: "black" }}>
                        {user.email}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admin/user/${user.accountId}`} style={{ color: "black" }}>
                        {user.phone}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admin/user/${user.accountId}`} style={{ color: "black" }}>
                        {user.age}
                      </Link>
                    </td>
                    <td>
                      {user.block ?
                        <span
                          className="error"
                        >Banned</span>
                        : <button
                          className="btn btn-danger"
                          onClick={() => { banUserHandler(user, admin.token) }}
                        >Ban</button>
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
