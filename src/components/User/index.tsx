import React from "react";
import { Link } from "react-router-dom";

const shortName = (name: string) => {
  return `${name.slice(0, 5)}..${name.slice(+name.length - 5)}`;
};

const User = (props: { id: string; handle?: string }) => {
  const { id, handle } = props;

  return (
    <span className="user mx-1">
      <Link to={`/members/${handle || id}`}>{handle || shortName(id)}</Link>
    </span>
  );
};

export default User;
