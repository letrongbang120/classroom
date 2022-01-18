import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { createDialogAtom } from "../../utils/atoms";
import { useForm } from 'react-hook-form'
import { createClass } from "../../actions/classAction";
import { useNavigate } from 'react-router-dom'

function CreateClass() {
  const [open, setOpen] = useRecoilState(createDialogAtom);
  const handleClose = () => {
    setOpen(false);
  };

  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const submitHanlder = async (data) => {
    const result = await createClass(data.room, data.name, user.accountId, data.theme, data.description, user.token);
    if (result) {
      navigate(`/c/${result.classId}`);
    }
    else {
      setMessage("Create class fail!!!");
    }
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create class</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHanlder)}>
          {
            message ? <span className="error">{message}</span> :
              <DialogContentText>
                Enter the name of class and we will create a classroom for you!
              </DialogContentText>
          }
          <TextField
            autoFocus
            margin="dense"
            label="Class Name"
            type="text"
            fullWidth
            {...register("name", { required: true })}
          />
          {errors.name?.type === "required" && <span className="error">Name of class is required</span>}
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            {...register("description", { required: true })}
          />
          {errors.description?.type === "required" && <span className="error">Description of class is required</span>}
          <TextField
            margin="dense"
            label="Topic"
            type="text"
            fullWidth
            {...register("theme", { required: true })}
          />
          {errors.theme?.type === "required" && <span className="error">Topic of class is required</span>}
          <TextField
            margin="dense"
            label="Room"
            type="text"
            fullWidth
            {...register("room", { required: true })}
          />
          {errors.room?.type === "required" && <span className="error">Room of class is required</span>}
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
            >
              Create
            </Button>
          </DialogActions>
        </form>

      </DialogContent>

    </Dialog>
  );
}
export default CreateClass;
