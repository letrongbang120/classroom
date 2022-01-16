import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { getUserById, updateUser } from "../../actions/userActions";

function UserDetails() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({});

  const { userId } = useParams();
  useEffect(() => {
    const getUser = async () => {
      const result = await getUserById(userId);
      console.log(result);
      if (result) {
        setValue("fullname", result.username);
        setValue("email", result.email);
        setValue("studentId", result.studentId);
        setValue("phoneNumber", result.phone);
        setValue("age", result.age);
      }
    }
    getUser();
  }, [userId, setValue]);
  const navigate = useNavigate();
  const updateUserHanlder = (userInfo) => {
    const token = JSON.parse(localStorage.getItem("userSigninClassroom")).token;
    const update = async () => {
      const res = await updateUser(userInfo.fullname, userInfo.studentId, userInfo.phoneNumber, userInfo.age, token);
      if (res) {
        navigate('/admin/users');
        alert("Update success");
      } else {
        alert("Somthing went wrong!");
      }
    }
    update();
  }
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
              <form className="row g-2 needs-validation" onSubmit={handleSubmit(updateUserHanlder)}>
                <div>
                  <label htmlFor="ban" style={{ marginRight: "10px" }}>
                    Ban/Lock
                  </label>
                  <input type="checkbox" id="ban" name="ban" />
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
                    {...register("fullname", { required: true })}
                  />
                  {errors.fullname?.type === "required" && <span className="error">Name of user is required</span>}
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
                    {...register("email", { required: true })}
                  />
                  {errors.email?.type === "required" && <span className="error">Student ID of user is required</span>}
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
                    {...register("studentId", { required: true })}
                  />
                  {errors.studentId?.type === "required" && <span className="error">Student ID of user is required</span>}
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
                    {...register("phoneNumber", { required: true })}
                  />
                  {errors.phoneNumber?.type === "required" && <span className="error">Phone number of user is required</span>}
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
                    {...register("age", { required: true })}
                  />
                  {errors.age?.type === "required" && <span className="error">Age of user is required</span>}
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
