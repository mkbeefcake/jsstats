import React from "react";
import Status from "./Status";

const Modals = (props) => {
  const { showModal, toggleShowStatus, showStatus } = props;
  return (
    <div>
      {showStatus ? (
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
