import styled from "styled-components";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";
import { IIssueType, IMember, IStatus, ITask, ITShirtSize } from "./types";
import moment from "moment";
import {
  Avatar,
  Backdrop,
  Chip,
  createStyles,
  Fade,
  makeStyles,
  Modal,
  Theme,
  Typography,
} from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import LinkIcon from "@material-ui/icons/Link";
import { useState } from "react";
import EditIssueModal from "./EditIssueModal";

const dateFormat = "DD/MM/YYYY HH:mm:ss";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props: DraggableStateSnapshot) =>
    props.isDragging ? "#4038dd" : "#4038ff"};
`;

const Task = (props: {
  task: ITask;
  index: number;
  members: IMember[];
  statuses: IStatus[];
  issueTypes: IIssueType[];
  tShirtSizes: ITShirtSize[];
  editIssueCallback: (editedTask: ITask, shouldDelete: boolean) => void;
}) => {
  const [showEditIssueModal, setShowEditIssueModal] = useState(false);
  const creatorId = () => {
    return !props.task.creatorId
      ? "-"
      : props.members.filter((m) => m.id === props.task.creatorId)[0].name;
  };
  const openEditIssueModal = () => {
    setShowEditIssueModal(true);
  };

  const closeEditIssueModal = () => {
    setShowEditIssueModal(false);
  };

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      avatar: {
        position: "absolute",
        top: 0,
        right: 15,
        width: 25,
        height: 25,
      },
      orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
      chips: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        "& > *": {
          margin: theme.spacing(0.5),
        },
      },
      editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
      },
      url: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 40,
        height: 40,
      },
      taskDescription: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
      },
    })
  );

  const classes = useStyles();

  const AssigneeAvatar = () => {
    if (!props.task.assigneeId) {
      return (
        <div className={classes.avatar}>
          <Avatar>NA</Avatar>
        </div>
      );
    }
    const assignee = props.members.filter(
      (m) => m.id === props.task.assigneeId
    )[0];
    if (assignee.avatar) {
      return (
        <div className={classes.avatar}>
          <Avatar alt="Assignee Avatar" src={assignee.avatar} />
        </div>
      );
    }
    return (
      <div className={classes.avatar}>
        <Avatar className={classes.orange}>{assignee.name[0]}</Avatar>
      </div>
    );
  };

  return (
    <Draggable draggableId={`${props.task.id}`} index={props.index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isDropAnimating
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <Typography variant="h6">{props.task.title}</Typography>
            <div className={classes.taskDescription}>{props.task.content}</div>
            <AssigneeAvatar />
            <div className={classes.chips}>
              <Chip label={props.task.type} />
              <Chip hidden={!props.task.size} label={props.task.size} />
              <Chip label={`Funded: ${props.task.funded}`} />
              <Chip label={`Priority: ${props.task.priority}`} />
              <Chip label={`Author: ${creatorId()}`} />
              <Chip
                label={`Created: ${moment(props.task.creationDate).format(
                  dateFormat
                )}`}
              />
              <Chip
                label={`Updated: ${moment(props.task.updateDate).format(
                  dateFormat
                )}`}
              />
            </div>
            <Fab
              className={classes.url}
              hidden={!props.task.url}
              component="a"
              target="_blank"
              href={props.task.url}
            >
              <LinkIcon />
            </Fab>
            <Fab
              className={classes.editButton}
              color="secondary"
              aria-label="edit"
              onClick={openEditIssueModal}
            >
              <EditIcon />
            </Fab>
            <Modal
              open={showEditIssueModal}
              onClose={closeEditIssueModal}
              aria-labelledby="new-issue-modal-title"
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <div>
                <Fade in={showEditIssueModal}>
                  <EditIssueModal
                    task={props.task}
                    members={props.members}
                    issueTypes={props.issueTypes}
                    statuses={props.statuses}
                    tShirtSizes={props.tShirtSizes}
                    editIssueCallback={(
                      editedTask: ITask,
                      shouldDelete: boolean
                    ) => {
                      closeEditIssueModal();
                      props.editIssueCallback(editedTask, shouldDelete);
                    }}
                  />
                </Fade>
              </div>
            </Modal>
          </div>
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
