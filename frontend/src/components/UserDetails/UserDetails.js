import React from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Button from "@mui/material/Button";

const ban = false;

function UserDetails() {
  return (
    <div>
      <div className="container rounded bg-white ">
        <div className="row">
          <div className="col-md-3 border-right"></div>
          <div className="col-md-6 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-right">User Details</h2>
              </div>
              <form className="row g-2 needs-validation">
                <div>
                  <label for="ban" style={{ marginRight: "10px" }}>
                    Ban/Lock
                  </label>
                  {/* Truyền user vào rồi thay ban = user.ban (Xoá const ở trên) */}
                  {ban ? (
                    <Button style={{ color: "blue" }}>Unban</Button>
                  ) : (
                    <Button style={{ color: "red" }}>Ban</Button>
                  )}
                </div>

                <div className="col-md-12">
                  <label htmlFor="fullname" className="labels">
                    Fullname
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="form-control"
                    placeholder="Fullname"
                    value="Danh Hoàng"
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="email" className="labels">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value="hoangdanhh16@gmail.com"
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="studentId" className="labels">
                    ID Student
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    className="form-control"
                    placeholder="ID Student"
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="phoneNumber" className="labels">
                    Phone number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Phone number"
                    value="0123456789"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="age" className="labels">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    className="form-control"
                    placeholder="Your age"
                    value="21"
                  />
                </div>

                <div className="mt-5 text-center">
                  <button
                    className="btn btn-primary profile-button"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
