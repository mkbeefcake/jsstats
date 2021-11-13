import React from "react";
import MemberOverlay from "./MemberOverlay";

import { Council, Post, ProposalDetail } from "../../types";
import { Link } from "react-router-dom";
import InfoTooltip from "../Tooltip";

const linkStyle = {
  color: "#fff",
  display: "block",
  margin: 4,
  border: "1px solid #fff",
  borderRadius: "4px",
  fontSize: 13,
};

const MemberBox = (props: {
  council: Council;
  councils: Council[];
  member: { handle: string };
  proposals: ProposalDetail[];
  posts: Post[];
  id: number;
  startTime: number;
  placement: "left" | "bottom" | "right" | "top";
  validators: string[];
}) => {
  const { councils, council, member, posts, placement, proposals } = props;
  const handle = member?.handle || props.account;
  return (
    <InfoTooltip
      placement={placement}
      id={`overlay-${handle}`}
      title={
        <MemberOverlay
          member={member}
          councils={councils}
          council={council}
          proposals={proposals}
          posts={posts}
          startTime={props.startTime}
          validators={props.validators}
        />
      }
    >
      <Link
        variant={"button"}
        className="text-center p-2"
        style={linkStyle}
        to={`/members/${handle}`}
      >
        {handle}
      </Link>
    </InfoTooltip>
  );
};

export default MemberBox;
