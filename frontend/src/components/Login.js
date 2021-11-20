import React from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form'
import { GoogleLogin } from 'react-google-login'

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmitHandler = (data) => {
        console.log(data)
    }

    const handleSuccess = (googleData) => {
        console.log(googleData.tokenId);
    }
    const handleFailure = (result) => {
        alert(result);
    }

    return (
        <div className="card mx-auto mt-5" style={{ width: '25%' }}>
            <h1 className="card-header text-center">
                Login
            </h1>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            name="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            {...register('email', {
                                required: true,
                                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            })}
                        />
                        {errors.email?.type === "required" && <span className="error">Email is required</span>}
                        {errors.email?.type === "pattern" && <span className="error">Invalid entered email</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Password"
                            {...register("password", { required: true })}
                        />
                        {errors.password?.type === "required" && <span className="error">Password is required</span>}
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                        >
                            Remember
                        </label>
                    </div>
                    <div className='w-100' style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            type="submit"
                            className="btn btn-primary px-5"
                        >
                            Submit</button>
                    </div>

                    <div className='w-100' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <small>
                            Don't have an account?
                            <a href='/register' style={{ marginLeft: '10px' }}>
                                Sign up
                            </a>
                        </small>
                        <a href='/'>Forgot your password?</a>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText="Log in with Google"
                            onSuccess={handleSuccess}
                            onFailure={handleFailure}
                            cookiePolicy={'single_host_origin'}
                        ></GoogleLogin>
                    </div>
                </form>
            </div>
        </div>


    );

}

export default Login;