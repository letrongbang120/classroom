import React from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

function ClassDetails() {
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

                <div className="col-md-12">
                  <label htmlFor="fullname" className="labels">
                    Class Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="form-control"
                    placeholder="Fullname"
                    value="Web NC"
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="description" className="labels">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Description"
                    value="Phát triển Web Nâng cao"
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="topic" className="labels">
                    Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    className="form-control"
                    placeholder="Topic"
                    value="WebNC[18/3]"
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

export default ClassDetails;
