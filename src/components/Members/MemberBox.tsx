import React from "react";
import MemberOverlay from "./MemberOverlay";

import { Member, Post, ProposalDetail, Seat } from "../../types";
import { Link } from "@material-ui/core";
import InfoTooltip from "../Tooltip";

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
    <InfoTooltip
      placement={placement}
      id={`overlay-${handle}`}
      title={
        <MemberOverlay
          handle={handle}
          members={members}
          councils={props.councils}
          proposals={proposals}
          posts={posts}
          startTime={props.startTime}
          validators={props.validators}
        />
      }
    >
      <Link
        variant={"button"}
        style={{
          color: "#fff",
          display: "block",
          margin: 4,
          border: "1px solid #fff",
          borderRadius: "4px",
        }}
        href={`/members/${handle || account}`}
      >
        {handle || shortName(account)}
      </Link>
    </InfoTooltip>
  );
};

export default MemberBox;
