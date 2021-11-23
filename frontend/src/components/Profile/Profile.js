import React from "react";

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-2 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
              className="rounded-circle mt-5"
              width="150px"
              src="https://1000logos.net/wp-content/uploads/2021/05/Google-logo.png"
            />
            <span className="text-black-50">Yourmail@gmail.com</span>
            <span> </span>
          </div>
        </div>

        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
              
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-right">Profile Setting</h2>
            </div>
            
            <form className="row g-2 needs-validation">
              <div className="col-md-12">
                <label htmlFor="fullname" className="labels">Fullname</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="form-control"
                  placeholder="Fullname"
                  value=""
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="studentId" className="labels">ID Student</label>
                <input
                  type="text"
                  id="studentId"
                    name="studentId"
                  className="form-control"
                  placeholder="ID Student"
                  value=""
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="phoneNumber" className="labels">Phone number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  placeholder="Phone number"
                  value=""
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="age" className="labels">Age</label>
                <input
                  type="number"
                  id="age"
                  className="form-control"
                  placeholder="Your age"
                  value=""
                />
              </div>

              <div className="mt-5 text-center">
                <button className="btn btn-primary profile-button" type="submit">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="col-md-5">
            <div class="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-right">Change Password</h2>
            </div>
            
            <form className="row g-2 needs-validation">
              <div className="col-md-12">
                <label htmlFor="curPassword" className="labels">Your current password</label>
                <input
                  type="password"
                  id="curPassword"
                  name="curPassword"
                  className="form-control"
                  placeholder="Current password"
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="newPassword" className="labels">ID Student</label>
                <input
                  type="password"
                  id="newPassword"
                    name="studentId"
                  className="form-control"
                  placeholder="New password"
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="confirmPassword" className="labels">Phone number</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm password"
                />
              </div>

              <div className="mt-5 text-center">
                <button className="btn btn-primary profile-button" type="submit">
                  Change Password
                </button>
              </div>
            </form>
            </div>
        </div>
      
      </div>
    </div>
  );
}

export default Profile;
