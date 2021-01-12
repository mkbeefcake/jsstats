import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Back = (props: { target?: string }) => {
  return (
    <Link to={props.target || `/`}>
      <Button variant="secondary" className="p-1 m-1">
        Back
      </Button>
    </Link>
  );
};

export default Back;
