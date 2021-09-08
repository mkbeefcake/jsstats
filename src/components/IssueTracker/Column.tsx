import styled from "styled-components";
import Task from "./Task";
import { Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import { IColumn, IIssueType, IMember, IStatus, ITask, ITShirtSize } from "./types";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props: DroppableStateSnapshot) =>
    props.isDraggingOver ? "#4038dd" : "#4038ff"};
  flex-grow: 1;
  min-height: 100px;
`;

const InnerList = (props: {
  members: IMember[];
  tasks: ITask[];
  statuses: IStatus[];
  issueTypes: IIssueType[];
  tShirtSizes: ITShirtSize[];
  editIssueCallback: (editedTask: ITask, shouldDelete: boolean) => void;
}) => {
  return (
    <div>
      {props.tasks.map((task: ITask, index: number) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          members={props.members}
          statuses={props.statuses}
          issueTypes={props.issueTypes}
          tShirtSizes={props.tShirtSizes}
          editIssueCallback={props.editIssueCallback}
        />
      ))}
    </div>
  );
};

const Column = (props: {
  column: IColumn;
  tasks: ITask[];
  members: IMember[];
  statuses: IStatus[];
  issueTypes: IIssueType[];
  tShirtSizes: ITShirtSize[];
  editIssueCallback: (editedTask: ITask, shouldDelete: boolean) => void;
}) => {
  return (
    <Container>
      <Title>{props.column.title}</Title>
      <Droppable droppableId={props.column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
            {...provided.droppableProps}
            isUsingPlaceholder
          >
            <InnerList
              members={props.members}
              tasks={props.tasks}
              statuses={props.statuses}
              issueTypes={props.issueTypes}
              tShirtSizes={props.tShirtSizes}
              editIssueCallback={props.editIssueCallback}
            />
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;
