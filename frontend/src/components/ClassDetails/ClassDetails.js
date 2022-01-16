import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { getClass } from "../../actions/classAction";

function ClassDetails() {
  const { classId } = useParams();
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

  const [data, setData] = useState({});
  useEffect(() => {
    if (user) {
      const getClassInfo = async () => {
        const res = await getClass(classId, user.token);
        if (res) {
          setData(res);
        }
      }
      getClassInfo();
    }
  }, [user, classId])
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
                    value={data && data.name}
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
                    value={data && data.description}
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
                    value={data && data.theme}
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
