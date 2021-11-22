import React, { useRef } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useForm } from 'react-hook-form'
import axios from 'axios'

function Login() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmitHandler = (userInfo) => {
    try {
      const register = async () => {
        const { data } = await axios.post("/sign-up", {
          email: userInfo.email,
          password: userInfo.password,
          studentId: userInfo.studentId,
          phone: userInfo.phoneNumber,
          age: userInfo.age
        });
        console.log(data);
      };
      register();
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="card mx-auto mt-5" style={{ width: "25%" }}>
      <h1 className="card-header text-center">Register</h1>
      <div className="card-body ">
        <form
          className="row g-3 needs-validation"
          onSubmit={handleSubmit(onSubmitHandler)}>
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
              {...register("fullname", { required: true })}
            />
            {errors.fullname?.type === "required" && <span className="error">Fullname is required</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email..."
              {...register("email", {
                required: true,
                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
            />
            {errors.email?.type === "required" && (
              <span className="error">Email is required</span>
            )}
            {errors.email?.type === "pattern" && (
              <span className="error">Invalid entered email</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter password"
              {...register("password", {
                required: true,
                minLength: 6
              })}
            />
            {errors.password?.type === "required" && <span className="error">Password is required</span>}
            {errors.password?.type === "minLength" && <span className="error">Password has at least 6 characters</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              {...register("confirmPassword", {
                required: true,
                validate: value =>
                  value === password.current || "Confirm password do not match"
              })}
            />
            {errors.confirmPassword?.message && <span className="error">{errors.confirmPassword.message}</span>}
            {errors.confirmPassword?.type === "required" && <span className="error">Confirm password is required</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studentId">ID student</label>
            <input
              type="text"
              className="form-control"
              id="studentId"
              name="studentId"
              placeholder="ID student"
              {...register("studentId", { required: true })}
            />
            {errors.studentId?.type === "required" && <span className="error">StudentId is required</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone number</label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              placeholder="Phone number"
              {...register("phoneNumber", { required: true })}
            />
            {errors.phoneNumber?.type === "required" && <span className="error">Phone number is required</span>}
          </div>

          <div className="form-group">
            <label htmlFor="age">Phone number</label>
            <input
              type="number"
              className="form-control"
              id="age"
              placeholder="Your age"
              {...register("age", { required: true })}
            />
            {errors.age?.type === "required" && <span className="error">Age number is required</span>}
          </div>

          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button
              className="btn btn-primary"
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
