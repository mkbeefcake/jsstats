import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Back from "../Back";

const Navigation = () => {
  return (
    <div className="d-flex flex-row justify-content-center">
      <Back />

      <Link to={`/councils`}>
        <Button variant="secondary" className="p-1 m-1">
          Previous Councils
        </Button>
      </Link>
    </div>
  );
};

export default Navigation;
