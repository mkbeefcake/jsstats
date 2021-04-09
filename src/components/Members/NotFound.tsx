import React from "react";
import { Link } from "react-router-dom";
import { Back } from "..";

const NotFound = (props: { nolink?: boolean }) => {
  return (
    <>
      <Back history={props.history} />
      <div className="box">
        <div>No membership found.</div>
        {props.nolink || <Link to={`/members`}>Back</Link>}
      </div>
    </>
  );
};

export default NotFound;
