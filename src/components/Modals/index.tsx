import Status from "./Status";
import EditKpi from "./EditKpi";

const Modals = (props) => {
  const { editKpi, toggleEditKpi, showModal, toggleShowStatus, showStatus } =
    props;
  return (
    <div>
      {editKpi ? (
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
