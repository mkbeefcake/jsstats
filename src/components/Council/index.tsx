import React from "react";
import { Link } from "react-router-dom";
import ElectionStatus from "./ElectionStatus";
import User from "../User";
import Loading from "../Loading";
import { Member } from "../../types";

const CouncilMember = (props: { member: Member }) => {
  const { account, handle } = props.member;
  return (
    <div className="col">
      <User id={String(account)} handle={handle} />
    </div>
  );
};

const Council = (props: {
  council: Member[];
  councilElection?: any;
  block: number;
  stage: any;
  termEndsAt: number;
}) => {
  const { council, block, councilElection, termEndsAt } = props;
  const half = Math.floor(council.length / 2);
  const show = council.length;

  return (
    <div className="box">
      <ElectionStatus
        show={show}
        stage={props.stage}
        termEndsAt={termEndsAt}
        block={block}
        {...councilElection}
      />
      <h3>Council</h3>

      {(show && (
        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            {council.slice(0, half).map((member) => (
              <CouncilMember key={String(member.account)} member={member} />
            ))}
          </div>
          <div className="d-flex flex-row">
            {council.slice(half).map((member) => (
              <CouncilMember key={String(member.account)} member={member} />
            ))}
          </div>
        </div>
      )) || <Loading />}
      <hr />

      <Link to={`/tokenomics`}>Reports</Link>
    </div>
  );
};

export default Council;
