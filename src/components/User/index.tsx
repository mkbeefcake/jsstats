import React from "react";
import { Link } from "react-router-dom";

const User = (props: { id: string; handle: string }) => {
  const { handle } = props;

  return (
    <span className="user mx-1">
      <Link to={`/members/${handle}`}>{handle}</Link>
    </span>
  );
};

export default User;
