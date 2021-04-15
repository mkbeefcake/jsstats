import React from "react";
import { Button, Spinner } from "react-bootstrap";

const Loading = (props: { target?: string }) => {
  const { target } = props;
  const title = target ? `Fetching ${target}` : "Connecting to Websocket";
  return (
    <Button variant="warning" className="m-1 py-0 mr-2">
      <Spinner animation="border" variant="dark" size="sm" className="mr-1" />
      {title}
    </Button>
  );
};

export default Loading;
