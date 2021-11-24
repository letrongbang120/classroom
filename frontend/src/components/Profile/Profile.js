import React, { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form'
import { useParams } from "react-router";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { getUserById } from "../../actions/userActions";

function Profile() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({});
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    formState: { errors: errors2 }
  } = useForm({});

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
    console.log(data)
  }

  const newPassword = useRef({});
  newPassword.current = watch2("newPassword", "");
  const submitPassword = (data) => {
    console.log(data);
  }

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-2 border-right">
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

        <div className="col-md-5 border-right">
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
                  {...register("fullname")}
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
                  {...register("studentId")}
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="phoneNumber" className="labels">Phone number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  placeholder="Phone number"
                  {...register("phoneNumber")}
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="age" className="labels">Age</label>
                <input
                  type="number"
                  id="age"
                  className="form-control"
                  placeholder="Your age"
                  {...register("age")}
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

        <div className="col-md-5">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-right">Change Password</h2>
            </div>
            <form className="row g-2 needs-validation" onSubmit={handleSubmit2(submitPassword)}>
              <div className="col-md-12">
                <label htmlFor="curPassword" className="labels">Your current password</label>
                <input
                  type="password"
                  id="curPassword"
                  name="curPassword"
                  className="form-control"
                  placeholder="Current password"
                  {...register2("currentPassword")}
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="newPassword" className="labels">New password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="studentId"
                  className="form-control"
                  placeholder="New password"
                  {...register2("newPassword", { minLength: 6 })}
                />
              </div>
              {errors2.newPassword?.type === "minLength" && <span className="error">Password must contain at least 6 characters</span>}

              <div className="col-md-12">
                <label htmlFor="confirmPassword" className="labels">Phone number</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  {...register2("confirmNewPassword", {
                    minLength: 6,
                    validate: value =>
                      value === newPassword.current || "Confirm password doesn't match"
                  })}
                />
                {errors2.confirmNewPassword?.message && <span className="error">{errors2.confirmNewPassword.message}</span>}
                {errors2.confirmNewPassword?.type === "minLength" && <span className="error">Password must contain at least 6 characters</span>}
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
