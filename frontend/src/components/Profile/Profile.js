import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { useParams } from "react-router";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { getUserById, updateUser } from "../../actions/userActions";

function Profile() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({});

  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const { userId } = useParams();
  useEffect(() => {
    const getUser = async () => {
      const result = await getUserById(userId);
      if (result) {
        setUser(result);
        setValue("fullname", result.username);
        setValue("studentId", result.studentId);
        setValue("phoneNumber", result.phone);
        setValue("age", result.age);
      }
      else {
        setMessage("User ID not found");
      }
    }
    getUser();
  }, [userId, setValue]);

  const submitProfile = (data) => {
    const token = JSON.parse(localStorage.getItem("userSigninClassroom")).token;
    const update = async () => {
      const res = await updateUser(data.fullname, data.studentId, data.phoneNumber, data.age, token);
      if (res) {
        alert("success. Reload to see the change.");
      } else {
        alert("fail");
      }
    }
    update();
  }

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      {message ?
        <span className="error">{message}</span> :
        <div className="row">
          <div className="col-md-4 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                className="rounded-circle mt-5"
                width="150px"
                src="https://1000logos.net/wp-content/uploads/2021/05/Google-logo.png"
                alt="google classroom"
              />
              <span className="text-black-50">{user.email ? user.email : ""}</span>
            </div>
          </div>

          <div className="col-md-8 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-right">Profile Setting</h2>
              </div>
              <form className="row g-2 needs-validation" onSubmit={handleSubmit(submitProfile)}>
                <div className="col-md-12">
                  <label htmlFor="fullname" className="labels">Fullname</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="form-control"
                    placeholder="Fullname"
                    {...register("fullname", { required: true })}
                  />
                  {errors.fullname?.type === "required" && <span className="error">Name of user is required</span>}
                </div>

                <div className="col-md-12">
                  <label htmlFor="studentId" className="labels">ID Student</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    className="form-control"
                    placeholder="ID Student"
                    {...register("studentId", { required: true })}
                  />
                  {errors.studentId?.type === "required" && <span className="error">Student ID of user is required</span>}
                </div>

                <div className="col-md-12">
                  <label htmlFor="phoneNumber" className="labels">Phone number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Phone number"
                    {...register("phoneNumber", { required: true })}
                  />
                  {errors.phoneNumber?.type === "required" && <span className="error">Phone number of user is required</span>}
                </div>

                <div className="col-md-12">
                  <label htmlFor="age" className="labels">Age</label>
                  <input
                    type="number"
                    id="age"
                    className="form-control"
                    placeholder="Your age"
                    {...register("age", { required: true })}
                  />
                  {errors.age?.type === "required" && <span className="error">Age of user is required</span>}
                </div>
                <div className="mt-5 text-center">
                  <button className="btn btn-primary profile-button" type="submit">
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>


        </div>
      }

    </div>
  );
}

export default Profile;
