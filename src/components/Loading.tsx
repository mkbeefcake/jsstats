import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = (props: { target?: string }) => {
  const { target } = props;
  return (
    <div className="h-100 d-flex flex-column flex-grow-1 align-items-center justify-content-center p-1">
      <Spinner
        animation="border"
        variant="light"
        title={target ? `Loading ${target}` : "Connecting to Websocket"}
      />
    </div>
  );
};

export default Loading;
