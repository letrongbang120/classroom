import React from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from '../../actions/userActions';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();
  const onGetPassword = async (email) => {
    const res = await forgotPassword(email);
    if (res) {
      alert("Check your email to get new password");
      navigate('/login');
    } else {
      alert("Wrong email!");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onGetPassword)} className='text-center mt-5'>
        <div>
          <label>User email: </label>
          <input
            type="text"
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
        <div>
          <button type='submit' className='btn btn-primary'>Get password</button>
        </div>
      </form>
    </div>
  )
}
