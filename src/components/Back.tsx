import React from "react";
import { Button } from "react-bootstrap";

const Back = (props: { hide?: boolean; target?: string; history: any }) => {
  if (props.hide) return <span />;
  const goBack = () => props.history.goBack();
  return (
    <Button variant="secondary" className="p-1 m-1" onClick={goBack}>
      Back
    </Button>
  );
};

export default Back;
