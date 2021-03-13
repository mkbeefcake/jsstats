import React from "react";
import { Link } from "react-router-dom";
import ElectionStatus from "./ElectionStatus";
import MemberBox from "../Members/MemberBox";
import Loading from "../Loading";
import { Handles, Member, Post, ProposalDetail, Seat } from "../../types";

const Council = (props: {
  councils: Seat[][];
  councilElection?: any;
  block: number;
  members: Member[];
  stage: any;
  termEndsAt: number;
  proposals: ProposalDetail[];
  posts: Post[];
  now: number;
  validators: string[];
  handles: Handles;
  round: number;
}) => {
  const { councilElection, members, handles, round, termEndsAt } = props;

  const council = props.councils[props.councils.length - 1];
  const show = round && council;
  const half = show ? Math.floor(council.length / 2) : 0;

  const startTime = props.now - props.block * 6000;

  return (
    <div className="box">
      <ElectionStatus
        show={show}
        stage={props.stage}
        termEndsAt={termEndsAt}
        block={props.block}
        {...councilElection}
      />
      <h3>Council</h3>

      {(show && (
        <div className="d-flex flex-column">
          <div className="d-flex flex-row justify-content-between">
            {council.slice(0, half).map((m) => (
              <div key={m.member} className="box">
                <MemberBox
                  id={m.id || 0}
                  account={m.member}
                  handle={m.handle || handles[m.member]}
                  members={members}
                  councils={props.councils}
                  proposals={props.proposals}
                  placement={"top"}
                  posts={props.posts}
                  startTime={startTime}
                  validators={props.validators}
                />
              </div>
            ))}
          </div>
          <div className="d-flex flex-row justify-content-between">
            {council.slice(half).map((m) => (
              <div key={m.member} className="box">
                <MemberBox
                  key={m.member}
                  id={m.id || 0}
                  account={m.member}
                  handle={m.handle || handles[m.member]}
                  members={members}
                  councils={props.councils}
                  proposals={props.proposals}
                  placement={"top"}
                  posts={props.posts}
                  startTime={startTime}
                  validators={props.validators}
                />
              </div>
            ))}
          </div>
        </div>
      )) || <Loading />}
    </div>
  );
};

export default Council;
