import React from "react";
import { Button } from "react-bootstrap";

const Types = (props: any) => {
  const { toggleHide, hidden, show, types } = props;
  if (!show) return <div />;
  return (
    <div className="bg-dark p-2">
      {Object.keys(types).map((type) => (
        <Button
          key={type}
          variant={hidden.includes(type) ? "secondary" : "outline-light"}
          className="btn-sm m-1"
          onClick={() => toggleHide(type)}
        >
          {type}
        </Button>
      ))}
    </div>
  );
};

export default Types;
