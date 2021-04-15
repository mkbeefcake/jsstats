import React from "react";
import ElectionStatus from "./ElectionStatus";
import MemberBox from "../Members/MemberBox";
import Loading from "../Loading";

import {
  Handles,
  Member,
  Post,
  ProposalDetail,
  Seat,
  Status,
} from "../../types";

const Council = (props: {
  councils: Seat[][];
  councilElection?: any;
  members: Member[];
  proposals: ProposalDetail[];
  posts: Post[];
  validators: string[];
  handles: Handles;
  status: Status;
  electionPeriods: number[];
}) => {
  const { councils, handles, members, posts, proposals, status } = props;
  const council = councils[councils.length - 1];
  if (!council) return <Loading target="council" />;

  return (
    <div className="box w-50 p-3 m-3">
      <h3>Council</h3>
      <div className="d-flex flex-wrap justify-content-between">
        {council
          .sort((a, b) => handles[a.member].localeCompare(handles[b.member]))
          .map((m) => (
            <div key={m.member} className="col-12 col-md-4">
              <MemberBox
                id={m.id || 0}
                account={m.member}
                handle={handles[m.member]}
                members={members}
                councils={councils}
                proposals={proposals}
                placement={"bottom"}
                posts={posts}
                startTime={status.startTime}
                validators={props.validators}
              />
            </div>
          ))}
      </div>
      <hr />
      <ElectionStatus domain={props.domain} status={status} />
    </div>
  );
};

export default Council;
