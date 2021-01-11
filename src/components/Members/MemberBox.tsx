import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
//import { Link } from "react-router-dom";
import { Member, Post, ProposalDetail } from "../../types";
import { domain } from "../../config";
import MemberOverlay from "./Member";

const MemberBox = (props: {
  councils: number[][];
  members: Member[];
  proposals: ProposalDetail[];
  posts: Post[];
  id: number;
  account: string;
  handle: string;
  placement: "left" | "bottom" | "right" | "top";
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
          />
        </Tooltip>
      }
    >
      <div className="box">
        <a href={`${domain}/#/memners/`}>{handle}</a>
      </div>
    </OverlayTrigger>
  );
};

export default MemberBox;
