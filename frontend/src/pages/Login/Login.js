import React, { useEffect, useState } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from 'react-router-dom'
import { signin } from "../../actions/userActions";
import { OAuth2Client } from 'google-auth-library'

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      navigate("/dashboard");
    }
  }, [navigate]);
  const [message, setMessage] = useState("");

  const onSubmitHandler = async (userInfo) => {
    // const signin = async () => {
    //   try {
    //     const { data } = await axios.post("/sign-in", {
    //       email: userInfo.email,
    //       password: userInfo.password
    //     });
    //     if (data) {
    //       localStorage.setItem("userSigninClassroom", JSON.stringify(data));
    //       navigate("/dashboard");
    //     }
    //   } catch (error) {
    //     setMessage("Wrong email or password");
    //   }
    // };
    // signin();
    const result = await signin(userInfo.email, userInfo.password);
    if (result) {
      navigate("/dashboard");
    }
    else {
      setMessage("Wrong email or password");
    }
  };

  const handleSuccess = (googleData) => {
    console.log(googleData.tokenId);
    const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    const getTicket = async () => {
      const ticket = await client.verifyIdToken({
        idToken: googleData.tokenId
      });
      const { email } = ticket.getPayload();
      return { email }
    }
    const { ggEmail } = getTicket();
    console.log(ggEmail);
  };
  const handleFailure = (result) => {
    alert(result);
  };

  return (
    <div className="card mx-auto mt-5" style={{ width: "25%" }}>
      <h1 className="card-header text-center">Login</h1>
      <div className="card-body">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="row g-3 needs-validation"
        >
          {message && <span className="error">{message}</span>}
          <div className="form-group">
            <label htmlFor="loginAccount">Account</label>
            <input
              type="text"
              className="form-control"
              id="loginAccount"
              placeholder="Enter account"
              autoFocus
              {...register("email", {
                required: true,
                pattern:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              className="form-control"
              id="loginPassword"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password?.type === "required" && (
              <span className="error">Password is required</span>
            )}
          </div>

          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </div>

          <div
            className="w-100"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <small>
              Don't have an account?
              <a href="/register" style={{ marginLeft: "10px", color: "#2583ff" }}>
                Sign up
              </a>
            </small>
            <a href="/" style={{ color: "#2583ff" }}>Forgot your password?</a>
          </div>
          <div style={{ textAlign: "center" }}>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Log in with Google"
              onSuccess={handleSuccess}
              onFailure={handleFailure}
              cookiePolicy={"single_host_origin"}
            ></GoogleLogin>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
