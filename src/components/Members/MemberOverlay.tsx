import React from "react";
import { Member, Post, ProposalDetail } from "../../types";
import { domain } from "../../config";
import Summary from "./Summary";
import NotFound from "./NotFound";

const MemberBox = (props: {
  handle: string;
  members: Member[];
  councils: number[][];
  proposals: ProposalDetail[];
  posts: Post[];
  startTime: number;
}) => {
  const { councils, handle, members, posts, proposals, startTime } = props;
  const member = members.find((m) => m.handle === handle);
  if (!member) return <NotFound nolink={true} />;

  const council = councils[councils.length - 1];
  if (!council) return <div>Loading..</div>;
  const isCouncilMember = council.includes(member.id);

  return (
    <div className="box">
      {isCouncilMember && <div>council member</div>}
      <a href={`${domain}/#/members/${handle}`}>
        <h1>{handle}</h1>
      </a>

      <Summary
        councils={councils}
        handle={handle}
        member={member}
        posts={posts}
        proposals={proposals}
        startTime={startTime}
      />
    </div>
  );
};

export default MemberBox;
