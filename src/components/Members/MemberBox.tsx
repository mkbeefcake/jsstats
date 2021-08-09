import React from "react";
import MemberOverlay from "./MemberOverlay";

import { Council, Post, ProposalDetail } from "../../types";
import { Link } from "react-router-dom";
import InfoTooltip from "../Tooltip";

const shortName = (key) => `${key.slice(0, 5)}..${key.slice(key.length - 5)}`;

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
  const {
    account,
    councils,
    council,
    member,
    posts,
    placement,
    proposals,
  } = props;

  const handle = member ? member.handle : shortName(account);
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
        className="text-center"
        style={{
          color: "#fff",
          display: "block",
          margin: 4,
          border: "1px solid #fff",
          borderRadius: "4px",
        }}
        to={`/members/${handle}`}
      >
        {handle}
      </Link>
    </InfoTooltip>
  );
};

export default MemberBox;
