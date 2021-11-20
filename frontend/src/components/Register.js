import React from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const validation = {
    password: "",
    confirmPassword: "",
  }

  const handleSubmit = (e) => {
    const { password, confirmPassword } = validation;
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      e.preventDefault();
    }
    else if (password.length < 6) {
      alert("Your password must be at least 6 characters long. Please try a different password.");
      e.preventDefault();
    }
  }

  return (
    <div className="card mx-auto mt-5" style={{ width: "25%" }}>
      <h1 className="card-header text-center">Register</h1>
      <div className="card-body ">
        <form className="row g-3 needs-validation">
          
          <div className="form-group">
            <label htmlFor="registerFullname" className="form-label">
              Fullname
            </label>
            <input
              type="text"
              className="form-control"
              id="registerFullname"
              placeholder="Fullname"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="registerAccount">Account</label>
            <input
              type="text"
              className="form-control"
              id="registerAccount"
              placeholder="Account"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="registerPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="registerPassword1"
              placeholder="Password"
              required
              onChange={(e) => {
                validation.password = e.target.value;
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="registerPassword2">Confirm password</label>
            <input
              type="password"
              className="form-control"
              id="registerPassword2"
              placeholder="Confirm password"
              required
              onChange={(e) => {
                validation.confirmPassword = e.target.value;
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="registerID">ID student</label>
            <input
              type="text"
              className="form-control"
              id="registerID"
              placeholder="ID student"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="registerGmail">Gmail</label>
            <input
              type="email"
              className="form-control"
              id="registerGmail"
              placeholder="Gmail"
              required
            />
          </div>

          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button className="btn btn-primary" type="submit" onClick = {(e)=>{handleSubmit(e)}}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
