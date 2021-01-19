import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import MemberOverlay from "./MemberOverlay";

import { Member, Post, ProposalDetail, Seat } from "../../types";

const shortName = (name: string) => {
  return `${name.slice(0, 5)}..${name.slice(+name.length - 5)}`;
};

const MemberBox = (props: {
  councils: Seat[][];
  members: Member[];
  proposals: ProposalDetail[];
  posts: Post[];
  id: number;
  account: string;
  handle: string;
  startTime: number;
  placement: "left" | "bottom" | "right" | "top";
  validators: string[];
}) => {
  const { account, handle, members, posts, placement, proposals } = props;
  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip id={`overlay-${handle}`} className="member-tooltip">
          <MemberOverlay
            handle={handle}
            members={members}
            councils={props.councils}
            proposals={proposals}
            posts={posts}
            startTime={props.startTime}
            validators={props.validators}
          />
        </Tooltip>
      }
    >
      <Link to={`/members/${handle || account}`}>
        {handle || shortName(account)}
      </Link>
    </OverlayTrigger>
  );
};

export default MemberBox;
