import React from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

function AdminDetails() {
  return (
    <div>
      {/* Check role before navigate to AdminDetails... */}
      <div className="container rounded bg-white ">
        <div className="row">
          <div className="col-md-3 border-right"></div>
          <div className="col-md-6 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-right">Admin Details</h2>
              </div>
              <form className="row g-2 needs-validation">
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

                <div className="col-md-12">
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

export default AdminDetails;
