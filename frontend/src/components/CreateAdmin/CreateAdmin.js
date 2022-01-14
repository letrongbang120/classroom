import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { createAdmin } from "../../actions/superAdminAction";

function CreateAdmin() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const password = useRef({});
  password.current = watch("password", "");
  const [user, setUser] = useState();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmitHandler = async (adminInfo) => {
    const res = await createAdmin({
      email: adminInfo.email,
      password: adminInfo.password,
      studentId: adminInfo.studentId,
      phone: adminInfo.phone,
      age: adminInfo.age
    }, user.token);
    if (res) {
      navigate('/superadmin');
    }
    else {
      alert("Something went wrong!!!");
    }
  }

  return (
    <div>
      <div className="card mx-auto mt-5" style={{ width: "25%" }}>
        <h1 className="card-header text-center">Create Admin</h1>
        <div className="card-body ">
          <form
            className="row g-3 needs-validation"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Enter your email..."
                {...register("email", {
                  required: true,
                  pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
              />
              {errors.email?.type === "required" && <span className="error">Email is required</span>}
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
                placeholder="Enter password"
                {...register("password", {
                  required: true,
                  minLength: 6
                })}
              />
              {errors.Password?.type === "required" && <span className="error">Password is required</span>}
              {errors.password?.type === "minLength" && <span className="error">Password has at least 6 characters</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: true,
                  validate: value =>
                    value === password.current || "Confirm password do not match"
                })}
              />
              {errors.confirmPassword?.type === "required" && <span className="error">Confirm password is required</span>}
              {errors.confirmPassword?.message && <span className="error">{errors.confirmPassword.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="studentId" className="form-label">
                StudentID
              </label>
              <input
                type="text"
                className="form-control"
                id="studentId"
                placeholder="Student ID"
                {...register("studentId", {
                  required: true,
                })}
              />
              {errors.studentId?.type === "required" && <span className="error">Student ID is required</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone number</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Phone number"
                {...register("phone", { required: true })}
              />
              {errors.phone?.type === "required" && <span className="error">Phone number is required</span>}
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                className="form-control"
                id="age"
                placeholder="Your age"
                {...register("age", { required: true })}
              />
              {errors.age?.type === "required" && <span className="error">Age is required</span>}
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
