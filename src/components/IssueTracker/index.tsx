import {
  Backdrop,
  createStyles,
  Fab,
  Fade,
  Grid,
  makeStyles,
  Modal,
  Theme,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PeopleIcon from "@material-ui/icons/People";
import styled from "styled-components";
import Column from "./Column";
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  IColumn,
  IColumnsData,
  IIssueType,
  IMember,
  IStatus,
  ITask,
  ITShirtSize,
} from "./types";
import { tasksEndpoint } from "../../config";
import NewIssueModal from "./NewIssueModal";
import NewMemberModal from "./NewMemberModal";
import MembersModal from "././MembersModal";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
    },
  })
);

const IssueTracker = () => {
  const classes = useStyles();
  const [columnsData, setColumnsData] = useState({} as IColumnsData);
  const [members, setMembers] = useState([] as IMember[]);
  const [tasks, setTasks] = useState([] as ITask[]);
  const [shouldReloadIssues, setShouldReloadIssues] = useState(true);
  const [shouldReloadMembers, setShouldReloadMembers] = useState(true);
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [statuses, setStatuses] = useState([] as IStatus[]);
  const [issueTypes, setIssueTypes] = useState([] as IIssueType[]);
  const [tShirtSizes, setTShirtSizes] = useState([] as ITShirtSize[]);

  const loadConfig = async () => await axios.get(`${tasksEndpoint}/config`);
  const loadIssues = async () => await axios.get(`${tasksEndpoint}/issues`);
  const loadMembers = async () => await axios.get(`${tasksEndpoint}/members`);

  const updateIssue = async (body: ITask) =>
    await axios.put(`${tasksEndpoint}/issues/${body.id}`, body);
  const deleteIssue = async (body: ITask) =>
    await axios.delete(`${tasksEndpoint}/issues/${body.id}`);
  const createIssue = async (body: ITask) =>
    await axios.put(`${tasksEndpoint}/issues`, body);
  const createMember = async (body: IMember) =>
    await axios.put(`${tasksEndpoint}/members`, body);
  const updateMember = async (body: IMember) =>
    await axios.put(`${tasksEndpoint}/members/${body.id}`, body);
  const deleteMember = async (body: IMember) =>
    await axios.delete(`${tasksEndpoint}/members/${body.id}`);

  useEffect(() => {
    loadConfig().then((response) => {
      if (!response.data || response.data.error) {
        console.error(`failed to fetch from API`);
        return;
      }
      const statuses = response.data.statuses as IStatus[];
      const issueTypes = response.data.issueTypes as IIssueType[];
      const tShirtSizes = response.data.tShirtSizes as IIssueType[];
      setStatuses(statuses);
      setIssueTypes(issueTypes);
      setTShirtSizes(tShirtSizes);
      const ordered = statuses.sort((a, b) => (a.index > b.index ? 1 : -1));
      let columns = statuses.reduce(function (result, item, index, array) {
        const columnId = (item as IStatus).id;
        let res = result as { [key: string]: IColumn };
        res[columnId] = item;
        return res;
      }, {});
      const columnIds = ordered.map((s) => s.id);
      setColumnsData({
        columnOrder: columnIds,
        columns: columns,
      });
    });
  }, []);

  useEffect(() => {
    if (shouldReloadMembers) {
      loadMembers().then((response) => {
        if (!response.data || response.data.error) {
          console.error(`Failed to fetch from API`);
          setShouldReloadMembers(false);
          return;
        }
        const loaded = response.data.members as IMember[];
        setMembers([...loaded]);
        setShouldReloadMembers(false);
      });
    }
  }, [shouldReloadMembers]);

  useEffect(() => {
    if (shouldReloadIssues) {
      loadIssues().then((response) => {
        if (!response.data || response.data.error) {
          console.error(`Failed to fetch from API`);
          setShouldReloadIssues(false);
          return;
        }
        const loaded = response.data.issues as ITask[];
        setTasks([...loaded]);
        setShouldReloadIssues(false);
      });
    }
  }, [shouldReloadIssues]);

  const sortByPriorityAndDate = (tasks: ITask[]) =>
    tasks.sort((a: ITask, b: ITask) => {
      if (a.priority === b.priority) {
        return a.creationDate < b.creationDate ? 1 : -1;
      } else {
        return a.priority < b.priority ? 1 : -1;
      }
    });

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const home = columnsData.columns[source.droppableId] as IColumn;
    const foreign = columnsData.columns[destination.droppableId] as IColumn;
    let task = tasks.filter((t) => `${t.id}` === draggableId)[0] as ITask;
    if (home !== foreign) {
      task.status = foreign.id;
    }
    const columnTasks = sortByPriorityAndDate(
      tasks.filter((t) => t.status === foreign.id)
    );
    const currentIndex = columnTasks.indexOf(task);
    const newIndex = destination.index;
    columnTasks.splice(currentIndex, 1);
    columnTasks.splice(newIndex, 0, task);
    const updatedTasks = recalculatePriorities(columnTasks);
    setTasks((prevTasks) => {
      const updatedTasksById: { [key: string]: ITask } = updatedTasks.reduce(
        (result, item: ITask) => {
          const taskId = item.id;
          let res = result as { [key: string]: ITask };
          res[taskId] = item;
          return res;
        },
        {}
      );
      const newTasks = prevTasks;
      newTasks.forEach((t) => {
        const updated = updatedTasksById[t.id] as ITask;
        if (updated) {
          t.priority = updated.priority;
          t.status = updated.status;
        }
      });
      return newTasks;
    });
    updatedTasks.forEach((t, index) => {
      updateIssue(t).then((response) => {
        if (!response.data || response.data.error) {
          // TODO show alert with the error message
          console.error(`Failed to update issue.`);
        }
        setShouldReloadIssues(index === updatedTasks.length - 1);
      });
    });
  };

  const recalculatePriorities = (columnTasks: ITask[]): ITask[] => {
    let updatedTasks = [];
    let priorityCounter = 0;
    for (let i = columnTasks.length - 1; i >= 0; i--) {
      const currTask = columnTasks[i];
      currTask.priority = priorityCounter;
      updatedTasks.push(currTask);
      priorityCounter += 1;
    }
    return updatedTasks;
  };

  const tasksByStatus = (status: string) =>
    sortByPriorityAndDate(tasks.filter((task) => task.status === status));

  const openNewIssueModal = () => setShowNewIssueModal(true);
  const closeNewIssueModal = () => setShowNewIssueModal(false);
  const openNewMemberModal = () => setShowNewMemberModal(true);
  const closeNewMemberModal = () => setShowNewMemberModal(false);
  const openMembersModal = () => setShowMembersModal(true);
  const closeMembersModal = () => setShowMembersModal(false);

  const newMemberCallback = (newMember: IMember) => {
    closeNewMemberModal();
    createMember(newMember).then((response) => {
      if (!response.data || response.data.error) {
        // TODO show alert with the error message
        console.error(`Failed to create member.`);
      }
      const createdMember = response.data;
      setMembers((prev) => [...prev, createdMember]);
    });
  };

  const newIssueCallback = (newTask: ITask) => {
    closeNewIssueModal();
    const task = newTask;
    if (task.assigneeId === 0) {
      task.assigneeId = null;
    }
    if (task.creatorId === 0) {
      task.creatorId = null;
    }
    createIssue(task).then((response) => {
      if (!response.data || response.data.error) {
        // TODO show alert with the error message
        console.error(`Failed to create issue.`);
      }
      const createdTask = response.data;
      setTasks((prev) => [...prev, createdTask]);
      setShouldReloadIssues(true);
      setShouldReloadMembers(true);
    });
  };

  const editIssueCallback = (newTask: ITask, shouldDelete: boolean) => {
    const task = newTask;
    if (task.assigneeId === 0) {
      task.assigneeId = null;
    }
    if (shouldDelete) {
      deleteIssue(task).then((response) => {
        if (!response.data || response.data.error) {
          // TODO show alert with the error message
          console.error(`Failed to delete issue.`);
        }
        setTasks((prev) => {
          const index = prev.indexOf(prev.filter((t) => t.id === task.id)[0]);
          prev.splice(index, 1);
          return [...prev];
        });
      });
      return;
    }
    updateIssue(task).then((response) => {
      if (!response.data || response.data.error) {
        // TODO show alert with the error message
        console.error(`Failed to update issue.`);
      }
      const createdTask = response.data;
      setTasks((prev) => [...prev, createdTask]);
      setShouldReloadIssues(true);
      setShouldReloadMembers(true);
    });
  };

  const membersCallback = (
    updatedMembers: IMember[],
    deletedMembers: IMember[]
  ) => {
    closeMembersModal();
    deletedMembers.forEach((m, i) => {
      deleteMember(m).then((response) => {
        if (!response.data || response.data.error) {
          // TODO show alert with the error message
          console.error(`Failed to delete member.`);
        }
        setShouldReloadMembers(i === deletedMembers.length - 1);
        setShouldReloadIssues(i === deletedMembers.length - 1);
      });
    });
    updatedMembers.forEach((m) => {
      updateMember(m).then((response) => {
        if (!response.data || response.data.error) {
          // TODO show alert with the error message
          console.error(`Failed to update member.`);
        }
      });
    });
  };

  return (
    <Grid className={classes.root} item lg={12}>
      <Typography
        style={{ marginLeft: 10, marginRight: 10 }}
        variant="h2"
        className="mb-3"
      >
        Issues
      </Typography>
      <Fab
        onClick={openNewMemberModal}
        style={{
          position: "absolute",
          top: 20,
          right: 160,
        }}
        color="primary"
        aria-label="addMember"
      >
        <PersonAddIcon />
      </Fab>
      <Fab
        onClick={openMembersModal}
        style={{
          position: "absolute",
          top: 20,
          right: 90,
        }}
        color="primary"
        aria-label="addMember"
      >
        <PeopleIcon />
      </Fab>
      <Fab
        onClick={openNewIssueModal}
        style={{
          position: "absolute",
          top: 20,
          right: 230,
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <Fab
        onClick={() => {
          setShouldReloadIssues(true);
          setShouldReloadMembers(true);
        }}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
        color="primary"
        aria-label="refresh"
      >
        <RefreshIcon />
      </Fab>
      <Modal
        open={showNewIssueModal}
        onClose={closeNewIssueModal}
        aria-labelledby="new-issue-modal-title"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div>
          <Fade in={showNewIssueModal}>
            <NewIssueModal
              members={members}
              issueTypes={issueTypes}
              statuses={statuses}
              tShirtSizes={tShirtSizes}
              newIssueCallback={newIssueCallback}
            />
          </Fade>
        </div>
      </Modal>
      <Modal
        open={showNewMemberModal}
        onClose={closeNewMemberModal}
        aria-labelledby="new-member-modal-title"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div>
          <Fade in={showNewMemberModal}>
            <NewMemberModal newMemberCallback={newMemberCallback} />
          </Fade>
        </div>
      </Modal>
      <Modal
        open={showMembersModal}
        onClose={closeMembersModal}
        aria-labelledby="new-member-modal-title"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div>
          <Fade in={showMembersModal}>
            <MembersModal members={members} membersCallback={membersCallback} />
          </Fade>
        </div>
      </Modal>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {columnsData.columnOrder &&
            columnsData.columnOrder.map((columnId: string) => {
              const column = columnsData.columns[columnId] as IColumn;
              const columnTasks = tasksByStatus(column.id);
              return (
                <Column
                  key={column.id}
                  column={column!}
                  tasks={columnTasks}
                  members={members}
                  issueTypes={issueTypes}
                  statuses={statuses}
                  tShirtSizes={tShirtSizes}
                  editIssueCallback={editIssueCallback}
                />
              );
            })}
        </Container>
      </DragDropContext>
    </Grid>
  );
};

export default IssueTracker;
