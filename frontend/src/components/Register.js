import React from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function Login() {



    return (
        <div className="card mx-auto mt-5" style={{ width: '25%' }}>
            <h1 className="card-header text-center">
                Register
            </h1>

            <div className="card-body " >
                <form>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Account</label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Enter account"
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Confirm Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Confirm Password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">ID Student</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="ID Student" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Gmail</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Gmail" />
                    </div>

                    <div className='w-100' style={{ display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" className="btn btn-primary mt-3 px-5">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default Login;