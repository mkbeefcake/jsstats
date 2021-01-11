import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
//import { Link } from "react-router-dom";
import { Member, Post, ProposalDetail } from "../../types";
import MemberOverlay from "./Member";

const MemberBox = (props: {
  councils: number[][];
  members: Member[];
  proposals: ProposalDetail[];
  posts: Post[];
  id: number;
  account: string;
  handle: string;
}) => {
  const { councils, handle, members, posts, proposals } = props;
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id={`overlay-${handle}`}>
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
      <div className="box">{handle}</div>
    </OverlayTrigger>
  );
};

export default MemberBox;
