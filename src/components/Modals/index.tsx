import Status from "./Status";
import EditKpi from "./EditKpi";
import Event from "./Event";

const Modals = (props) => {
  const { editKpi, toggleEditKpi, showModal, toggleShowStatus, showStatus } =
    props;
  return (
    <div>
      {props.selectedEvent ? (
        <Event event={props.selectedEvent} onHide={props.selectEvent} />
      ) : editKpi ? (
        <EditKpi kpi={editKpi} cancel={toggleEditKpi} />
      ) : showStatus ? (
        <Status show={showStatus} onHide={toggleShowStatus} {...props} />
      ) : showModal === "validator" ? (
        <div />
      ) : (
        <div />
      )}
    </div>
  );
};
export default Modals;
