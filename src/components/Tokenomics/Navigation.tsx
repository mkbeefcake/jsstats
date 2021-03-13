import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Back from "../Back";

const Navigation = (props:{history:any}) => {
  return (
    <div className="d-flex flex-row justify-content-center">
      <Back history={props.history} />

      <Link to={`/councils`}>
        <Button variant="secondary" className="p-1 m-1">
          Previous Councils
        </Button>
      </Link>
    </div>
  );
};

export default Navigation;
