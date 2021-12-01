import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './style.css'

export default function Grade(props) {
  const [disable, setDisable] = useState(true);
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
  useEffect(() => {
    setValue("title", props.title);
    setValue("detail", props.detail);
  }, [props, setValue]);

  const deleteHandler = () => {
    const deleteGrade = {
      title: getValues("title"),
      detail: Number(getValues("grade"))
    };
    props.deleteGrades(deleteGrade);
  }
  const editHandler = () => {
    setDisable(false);
  }

  const updateHandler = (data) => {
    const updateGrade = {
      title: data.title,
      detail: Number(data.detail)
    };
    props.updateGrades({
      title: props.title,
      detail: props.detail
    }, updateGrade);
  }

  return (
    <form onSubmit={handleSubmit(updateHandler)} className="form-grade">
      <div className="form-grade__item">
        <label
          htmlFor="title"
          className={disable ? "disabled" : ''}
        >Grade title</label>
        <input
          type="text"
          placeholder="Title"
          className="form-grade__item-input"
          disabled={disable}
          {...register("title", { required: true })}
        />
      </div>
      {errors.title?.type === "required" && <span className="error">Tilte is required</span>}

      <div className="form-grade__item">
        <label
          htmlFor="detail"
          className={disable ? "disabled" : ''}
        >Grade detail</label>
        <input
          type="text"
          placeholder="Detail"
          className="form-grade__item-input"
          disabled={disable}
          {...register("detail", { required: true })}
        />
      </div>
      {errors.detail?.type === "required" && <span className="error">Detail is required</span>}

      <div>
        {disable ?
          <button className="btn btn-edit" onClick={editHandler}>Edit</button> :
          <button className="btn btn-submit" type="submit">Update</button>
        }
        <button className="btn btn-delete" onClick={deleteHandler}>Delete</button>
      </div>
    </form>
  )
}
