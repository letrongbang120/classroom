import React from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function Login() {
    return (
        <div className="card mx-auto mt-5"style={{width:'25%'}}>   
            <h1 className="card-header text-center">
                Login
            </h1>

            <div className="card-body " >
            <form>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Account</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter account"/>
                
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
            </div>
            <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                <label className="form-check-label" htmlFor="exampleCheck1">Remember</label>
            </div>
            <div className='w-100' style={{display: 'flex', justifyContent: 'center'}}>
                <button type="submit" className="btn btn-primary px-5">Submit</button>
            </div>  
            <div className='w-100' style ={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <small>
                    Don't have an account? 
                    <a href='/register' style={{marginLeft: '10px' }}>
                        Sign up
                    </a>
                </small>   
                <a href='/'>
                    Forgot your password?
                </a>
            </div>
         

            </form>
        </div>
    </div>
      
            
);
    
}

export default Login;