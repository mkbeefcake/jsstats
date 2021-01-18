import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const shortName = (name: string) => {
  return `${name.slice(0, 5)}..${name.slice(+name.length - 5)}`;
};

const User = (props: { id: string; handle?: string }) => {
  const { id, handle } = props;

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={id}>{id}</Tooltip>}
    >
      <span className="user mx-1">
        <Link to={`/members/${handle || id}`}>{handle || shortName(id)}</Link>
      </span>
    </OverlayTrigger>
  );
};

export default User;
