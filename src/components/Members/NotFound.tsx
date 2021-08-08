import React from "react";
import { Link } from "react-router-dom";
import { Back } from "..";

const NotFound = (props: { nolink?: boolean }) => {
  return (
    <div className="box">
      <div>No membership found.</div>
      <Back history={props.history} />
    </div>
  );
};

export default NotFound;
