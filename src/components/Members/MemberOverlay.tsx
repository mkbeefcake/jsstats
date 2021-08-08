import React from "react";
import { Council, Member, Post, ProposalDetail } from "../../types";
import { domain } from "../../config";
import Summary from "./Summary";
import NotFound from "./NotFound";

const MemberBox = (props: {
  member: Member[];
  council: Council;
  councils: Council[];
  proposals: ProposalDetail[];
  posts: Post[];
  startTime: number;
  validators: string[];
}) => {
  const { councils, council, member, posts, proposals, startTime } = props;

  if (!council) return <div>Loading..</div>;
  if (!member) return <NotFound nolink={true} />;

  const isCouncilMember = council.consuls.find(
    (seat) => seat.memberId === member.memberId
  );

  return (
    <div style={{ backgroundColor: "#4038FF", padding: 5 }}>
      {isCouncilMember && <div>council member</div>}
      <a href={`${domain}/#/members/${member.handle}`}>
        <h3>{member.handle}</h3>
      </a>

      <Summary
        councils={councils}
        council={council}
        member={member}
        posts={posts}
        proposals={proposals}
        startTime={startTime}
        validators={props.validators}
      />
    </div>
  );
};

export default MemberBox;
