import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="box">
      <div> Member not found</div>
      <Link to={`/members`}>Back</Link>
    </div>
  );
};

export default NotFound;
