import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Member, Post, ProposalDetail, Seat } from "../../types";
import MemberOverlay from "./MemberOverlay";

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
  const { councils, handle, members, posts, placement, proposals } = props;
  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip id={`overlay-${handle}`} className="member-tooltip">
          <MemberOverlay
            handle={handle}
            members={members}
            councils={councils}
            proposals={proposals}
            posts={posts}
            startTime={props.startTime}
            validators={props.validators}
          />
        </Tooltip>
      }
    >
      <Link to={`/members/${handle}`}>{handle}</Link>
    </OverlayTrigger>
  );
};

export default MemberBox;
