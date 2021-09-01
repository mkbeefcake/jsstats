import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { useState } from "react";
import { IMember } from "./types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
    },
    paper: {
      position: "absolute",
      width: 800,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: `50%`,
      left: `50%`,
      transform: `translate(-50%, -50%)`,
    },
    form: {
      "& > *": {
        margin: theme.spacing(1, 1, 1, 0),
      },
    },
  })
);

const NewMemberModal = (props: {
  newMemberCallback: (newMember: IMember) => void;
}) => {
  const classes = useStyles();
  const [newMember, setNewMember] = useState({
    name: "",
    avatar: "",
  } as IMember);

  const canSave = () => newMember.name !== "";

  return (
    <div className={classes.paper}>
      <h2 id="new-member-modal-title">Add Member</h2>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          fullWidth
          required
          id="issue-title"
          label="Name"
          variant="outlined"
          value={newMember.name}
          onChange={(e) =>
            setNewMember((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
        <TextField
          fullWidth
          id="issue-title"
          label="Avatar"
          variant="outlined"
          value={newMember.avatar}
          type="url"
          onChange={(e) =>
            setNewMember((prev) => ({
              ...prev,
              avatar: e.target.value,
            }))
          }
        />
        <Button
          disabled={!canSave()}
          style={{ float: "right" }}
          variant="contained"
          color="primary"
          onClick={() => {
            props.newMemberCallback(newMember);
          }}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default NewMemberModal;
