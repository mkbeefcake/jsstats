import React from "react";
import { Link } from "react-router-dom";

const NotFound = (props: { nolink?: boolean }) => {
  return (
    <div className="box">
      <div>No membership found.</div>
      {props.nolink || <Link to={`/members`}>Back</Link>}
    </div>
  );
};

export default NotFound;
