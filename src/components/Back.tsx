import React from "react";
import { Button } from "react-bootstrap";

const Back = (props: { target?: string; history: any }) => {
  const goBack = () => props.history.goBack();
  return (
    <Button variant="secondary" className="p-1 m-1" onClick={goBack}>
      Back
    </Button>
  );
};

export default Back;
