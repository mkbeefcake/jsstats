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
}) => {
  const { councils, status, members, handles, posts, proposals } = props;
  const council = councils[councils.length - 1];
  if (!council) return <Loading target="council" />;
  const third = Math.floor(council.length / 3);

  return (
    <div className="box w-50 p-3 m-3">
      <ElectionStatus domain={props.domain} status={status} />

      <h3>Council</h3>
      <div className="d-flex flex-row  justify-content-between">
        <div className="d-flex flex-column">
          {council.slice(0, third).map((m) => (
            <div key={m.member} className="box">
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
        <div className="d-flex flex-column">
          {council.slice(third, 2 * third).map((m) => (
            <div key={m.member} className="box">
              <MemberBox
                id={m.id || 0}
                account={m.member}
                handle={m.handle || handles[m.member]}
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
        <div className="d-flex flex-column">
          {council.slice(2 * third).map((m) => (
            <div key={m.member} className="box">
              <MemberBox
                key={m.member}
                id={m.id || 0}
                account={m.member}
                handle={m.handle || handles[m.member]}
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
      </div>
    </div>
  );
};

export default Council;
