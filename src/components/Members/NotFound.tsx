import React from "react";
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
