import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React from "react";
import { useRecoilState } from "recoil";
import { createDialogAtom } from "../../utils/atoms";

function CreateClass() {
  const [open, setOpen] = useRecoilState(createDialogAtom);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create class</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the name of class and we will create a classroom for you!
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Class Name"
          type="text"
          fullWidth
          required
        />
        <TextField margin="dense" label="Description" type="text" fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default CreateClass;
