import React from "react";
import { wsLocation } from "../../config";

const Status = (props: {
  connected: boolean,
  fetching: string,
  toggleShowStatus: () => void,
}) => {
  const { toggleShowStatus, connected, fetching } = props;
  if (!connected)
    return (
      <div className="connecting" onClick={toggleShowStatus}>
        Connecting to {wsLocation}
      </div>
    );
  if (!fetching.length) return <div />;
  return (
    <div className="connecting" onClick={toggleShowStatus}>
      Fetching {fetching}
    </div>
  );
};

export default Status;
