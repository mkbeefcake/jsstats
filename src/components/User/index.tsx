import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { domain } from "../../config";

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
      <div>
        <a href={`${domain}`}>{handle ? handle : shortName(id)}</a>
      </div>
    </OverlayTrigger>
  );
};

export default User;
