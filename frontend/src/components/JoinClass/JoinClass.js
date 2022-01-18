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
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getClass } from "../../actions/classAction";
import { joinDialogAtom } from "../../utils/atoms";

function JoinClass() {
  const [open, setOpen] = useRecoilState(joinDialogAtom);
  const [classId, setClassId] = useState('');
  const handleClose = () => {
    setOpen(false);
  };

  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const joinClass = async (e) => {
    e.preventDefault();
    const res = await getClass(classId, user.token);
    if (res) {
      navigate(`/c/${classId}`);
    }
    else {
      alert("Class ID is not found!")
    }
  }

  return (
    <div className="joinClass">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Join class</DialogTitle>
        <DialogContent>
          <form onSubmit={joinClass}>
            <DialogContentText>
              Enter ID of the class to join the classroom
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="ID Class"
              type="text"
              value={classId}
              onChange={(e) => { setClassId(e.target.value) }}
              fullWidth
              required
            />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" onClick={handleClose} color="primary">
                Join
              </Button>
            </DialogActions>
          </form>

        </DialogContent>

      </Dialog>
    </div>
  );
}

export default JoinClass;
