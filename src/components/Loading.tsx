import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = props => {
  return (
    <div className="w-100 h-100 d-flex flex-grow-1 align-items-center justify-content-center">
      <Spinner animation="grow" variant="dark" />
    </div>
  );
};

export default Loading;
