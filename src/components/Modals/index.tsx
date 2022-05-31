import Status from "./Status";
import EditKpi from "./EditKpi";
import Event from "./Event";
import Player from "./Player";

const Modals = (props) => {
  const { editKpi, toggleEditKpi, showModal, toggleShowStatus, showStatus } =
    props;
  return (
    <div>
      {props.video ? (
        <Player
          id={props.video}
          onHide={props.selectVideo}
          selectVideo={props.selectVideo}
          channel={props.media.storageBags.find((b) =>
            b.objects.find((o) => +o.id === +props.video)
          )}
        />
      ) : props.selectedEvent ? (
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
