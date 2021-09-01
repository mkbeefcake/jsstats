import {
  Button,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
} from "@material-ui/core";
import { useState } from "react";
import { IIssueType, IMember, IStatus, ITask } from "./types";

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

const NewIssueModal = (props: {
  members: IMember[];
  statuses: IStatus[];
  issueTypes: IIssueType[];
  newIssueCallback: (newTask: ITask) => void;
}) => {
  const classes = useStyles();
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    url: "",
    status: "TODO",
    type: "TASK",
    creatorId: 0,
    assigneeId: 0,
    funded: 0,
    priority: 0,
  } as ITask);

  const canSave = () =>
    newTask.title !== "" &&
    newTask.content !== "" &&
    newTask.creatorId &&
    newTask.creatorId !== 0;

  return (
    <div className={classes.paper}>
      <h2 id="new-issue-modal-title">Create Issue</h2>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          fullWidth
          required
          id="issue-title"
          label="Title"
          variant="outlined"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
        <TextField
          fullWidth
          required
          multiline
          rows={4}
          id="issue-content"
          label="Description"
          variant="outlined"
          value={newTask.content}
          onChange={(e) =>
            setNewTask((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
        />
        <TextField
          fullWidth
          id="issue-url"
          label="URL"
          type="url"
          variant="outlined"
          value={newTask.url}
          onChange={(e) =>
            setNewTask((prev) => ({
              ...prev,
              url: e.target.value,
            }))
          }
        />
        <FormControl required fullWidth variant="outlined">
          <InputLabel id="issue-type-select-label">Type</InputLabel>
          <Select
            labelId="issue-type-select-label"
            id="issue-type-select"
            value={newTask.type}
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev,
                type: e.target.value as string,
              }))
            }
            label="Type"
          >
            {props.issueTypes.map((s, i) => (
              <MenuItem key={i} value={s.id}>
                {s.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl required fullWidth variant="outlined">
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={newTask.status}
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev,
                status: e.target.value as string,
              }))
            }
            label="Status"
          >
            {props.statuses.map((s, i) => (
              <MenuItem key={i} value={s.id}>
                {s.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl required fullWidth variant="outlined">
          <InputLabel id="assignee-select-label">Author</InputLabel>
          <Select
            labelId="creator-select-label"
            id="creator-select"
            value={newTask.creatorId === 0 ? "" : newTask.creatorId}
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev,
                creatorId: e.target.value as number,
              }))
            }
            label="Author"
          >
            {props.members.map((s, i) => (
              <MenuItem key={i} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="assignee-select-label">Assignee</InputLabel>
          <Select
            labelId="assignee-select-label"
            id="assignee-select"
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev,
                assigneeId:
                  (e.target.value as string) === "Unassigned"
                    ? null
                    : (e.target.value as number),
              }))
            }
            label="Assignee"
            defaultValue="Unassigned"
          >
            <MenuItem value="Unassigned">Unassigned</MenuItem>
            {props.members.map((s, i) => (
              <MenuItem key={i} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          id="issue-funded"
          label="Funded"
          type="number"
          variant="outlined"
          value={newTask.funded}
          onChange={(e) =>
            setNewTask((prev) => ({
              ...prev,
              funded: e.target.value as unknown as number,
            }))
          }
        />
        <TextField
          fullWidth
          id="issue-priority"
          label="Priority"
          type="number"
          variant="outlined"
          value={newTask.priority}
          onChange={(e) =>
            setNewTask((prev) => ({
              ...prev,
              priority: e.target.value as unknown as number,
            }))
          }
        />
        <Button
          disabled={!canSave()}
          style={{ float: "right" }}
          variant="contained"
          color="primary"
          onClick={() => {
            props.newIssueCallback(newTask);
          }}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default NewIssueModal;
