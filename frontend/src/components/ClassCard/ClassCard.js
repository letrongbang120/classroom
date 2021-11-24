import React from "react";
import { IconButton } from "@material-ui/core";
import Tooltip from "@mui/material/Tooltip";
import CardActions from "@mui/material/CardActions";
import { AssignmentIndOutlined, FolderOpenOutlined } from "@material-ui/icons";
//import { useHistory } from "react-router-dom";
import "./ClassCard.css";
import { Link } from "react-router-dom";

function ClassCard(props) {
  return (
    <div className="classCard" >
      <div className="classCard__upper">
        <Link to={`/c/${props.classId}`}>
          <div className="classCard__className">{props.name}</div>
        </Link>
        <div className="classCard__creatorName">{props.teacherId}</div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png"
          className="classCard__creatorPhoto"
          alt="Teacher Logo"
        />
      </div>
      <div className="classCard__middle"></div>
      <div className="classCard__lower">
        <CardActions>
          <Tooltip title={`Open Exercises for "Class Name"`} arrow>
            <IconButton>
              <AssignmentIndOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Open Files for "Class Name" in Google Drive`} arrow>
            <IconButton>
              <FolderOpenOutlined />
            </IconButton>
          </Tooltip>
        </CardActions>
      </div>
    </div>
  );
}
export default ClassCard;
