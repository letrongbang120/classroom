import React from 'react'
import { useForm } from 'react-hook-form'
import './style.css'

export default function FormGrade(props) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const submitHandler = (data) => {
    props.addGrade(data);
    setValue('title', "");
    setValue('detail', 0);
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="form-grade">
      <h3>Add grade</h3>
      <div className="form-grade__item">
        <label htmlFor="title">Grade title</label>
        <input
          type="text"
          placeholder="Title"
          className="form-grade__item-input"
          {...register("title", { required: true })}
        />
      </div>
      {errors.title?.type === "required" && <span className="error">Tilte is required</span>}

      <div className="form-grade__item">
        <label htmlFor="detail">Grade detail</label>
        <input
          type="number"
          placeholder="Detail"
          className="form-grade__item-input"
          {...register("detail", { required: true })}
        />
      </div>
      {errors.detail?.type === "required" && <span className="error">Detail is required</span>}
      <button className="btn btn-submit" type="submit">Add</button>
    </form>
  )
}
