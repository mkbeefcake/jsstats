import React from "react";
import { Badge } from "react-bootstrap";
import { wsLocation } from "../../config";

const Status = (props: {
  connected: boolean,
  fetching: string,
  toggleShowStatus: () => void,
}) => {
  const { toggleShowStatus, connected, fetching } = props;
  const text = connected
    ? fetching.length
      ? `Fetching ${fetching}`
      : `Connected to ${wsLocation}`
    : `Connecting to ${wsLocation}`;
  return (
    <Badge
      className={connected ? "connected" : "connecting"}
      onClick={toggleShowStatus}
    >
      {text}
    </Badge>
  );
};

export default Status;
