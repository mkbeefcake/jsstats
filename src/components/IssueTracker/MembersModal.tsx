import {
  Button,
  Chip,
  createStyles,
  Divider,
  Fab,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import MoodBadIcon from "@material-ui/icons/MoodBad";
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
      display: "flex",
      "& > *": {
        margin: theme.spacing(1, 1, 1, 0),
      },
    },
    deletedMembers: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0,
    },
    deletedMemberChip: {
      margin: theme.spacing(0.5),
    },
  })
);

const MembersModal = (props: {
  members: IMember[];
  membersCallback: (members: IMember[], deletedMembers: IMember[]) => void;
}) => {
  const classes = useStyles();
  const [members, setMembers] = useState(props.members);
  const [deletedMembers, setDeletedMembers] = useState([] as IMember[]);

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
              <Fab
                style={{ float: "left" }}
                color="secondary"
                aria-label="delete"
                onClick={() => {
                  setDeletedMembers((prev) => [...prev, member]);
                  setMembers((prev) => {
                    const index = prev.indexOf(
                      prev.filter((m) => m.id === member.id)[0]
                    );
                    prev.splice(index, 1);
                    return [...prev];
                  });
                }}
              >
                <DeleteIcon />
              </Fab>
            </div>
          );
        })}
        <Divider hidden={deletedMembers.length === 0} />
        <Paper
          hidden={deletedMembers.length === 0}
          component="ul"
          className={classes.deletedMembers}
        >
          <Chip
            className={classes.deletedMemberChip}
            color="secondary"
            label="Users to be deleted:"
          />
          {deletedMembers.map((member) => {
            return (
              <li key={member.id}>
                <Chip
                  icon={<MoodBadIcon />}
                  label={member.name}
                  onDelete={() => {
                    setMembers((prev) => [...prev, member]);
                    setDeletedMembers((prev) => {
                      const index = prev.indexOf(
                        prev.filter((m) => m.id === member.id)[0]
                      );
                      prev.splice(index, 1);
                      return [...prev];
                    });
                  }}
                  className={classes.deletedMemberChip}
                />
              </li>
            );
          })}
        </Paper>
        <Button
          disabled={!canSave()}
          style={{ float: "right" }}
          variant="contained"
          color="primary"
          onClick={() => {
            props.membersCallback(members, deletedMembers);
          }}
        >
          Save All
        </Button>
      </form>
    </div>
  );
};

export default MembersModal;
