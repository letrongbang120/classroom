import React from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import SuperAdminHeader from "../SuperAdminHeader/SuperAdminHeader";

function CreateAdmin() {

  return (
    <div>
      <div className="card mx-auto mt-5" style={{ width: "25%" }}>
        <h1 className="card-header text-center">Create Admin</h1>
        <div className="card-body ">
          <form
            className="row g-3 needs-validation"
          >
            <div className="form-group">
              <label htmlFor="fullname" className="form-label">
                Fullname
              </label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                name="fullname"
                placeholder="Fullname"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                placeholder="Phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                className="form-control"
                id="age"
                placeholder="Your age"
              />
            </div>

            <div
              className="w-100"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className="btn btn-primary"
              >
                Create Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAdmin;
