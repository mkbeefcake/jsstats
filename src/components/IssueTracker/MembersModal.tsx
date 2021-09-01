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
    member: {
      "& > *": {
        margin: theme.spacing(1, 1, 1, 0),
      },
    },
  })
);

const MembersModal = (props: {
  members: IMember[];
  membersCallback: (members: IMember[]) => void;
}) => {
  const classes = useStyles();
  const [members, setMembers] = useState(props.members);

  const canSave = () =>
    members.filter((m) => m.name && m.name === "").length === 0;

  return (
    <div className={classes.paper}>
      <h2 id="new-member-modal-title">Members</h2>
      <form className={classes.form} noValidate autoComplete="off">
        {members.map((member, index) => {
          return (
            <div className={classes.member} key={index}>
              <TextField
                required
                id={`member-name-${index}`}
                label="Name"
                variant="outlined"
                value={member.name}
                onChange={(e) => {
                  setMembers((prev) => {
                    prev[index].name = e.target.value;
                    return [...prev];
                  });
                }}
              />
              <TextField
                style={{
                  width: 510,
                }}
                id={`member-avatar-${index}`}
                label="Avatar"
                variant="outlined"
                value={member.avatar}
                type="url"
                onChange={(e) => {
                  setMembers((prev) => {
                    prev[index].avatar = e.target.value;
                    return [...prev];
                  });
                }}
              />
            </div>
          );
        })}
        <Button
          disabled={!canSave()}
          style={{ float: "right" }}
          variant="contained"
          color="primary"
          onClick={() => {
            props.membersCallback(members);
          }}
        >
          Save All
        </Button>
      </form>
    </div>
  );
};

export default MembersModal;
