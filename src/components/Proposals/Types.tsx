import React from "react";
import { Button } from "react-bootstrap";

const Types = (props: {
  toggleShow: (type: string) => void;
  selected: string[];
  show: boolean;
  types: { [key: string]: number };
}) => {
  const { toggleShow, selected, show, types } = props;
  if (!show) return <div />;
  return (
    <div className="bg-dark p-2">
      {Object.keys(types).map((type) => (
        <Button
          key={type}
          variant={selected.includes(type) ? "secondary" : "outline-light"}
          className="btn-sm m-1"
          onClick={() => toggleShow(type)}
        >
          {type}
        </Button>
      ))}
    </div>
  );
};

export default Types;
