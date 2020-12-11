import React from "react";
import { Link } from "react-router-dom";
import Proposal from "./Proposal";
import { ProposalDetail } from "../../types";

const Proposals = (props: { proposals: ProposalDetail[] }) => {
  const { proposals } = props;

  const active = proposals.filter((p) => p.stage === "Active");
  const executing = proposals.filter((p) => p.exec);

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row">
        {(active.length &&
          active.map((p, key: number) => (
            <Link to={`/proposal/${p.id}`}>{p.id}</Link>
          ))) || <div className="box">No active proposals.</div>}
      </div>
      <div className="d-flex flex-row">
        {(executing.length &&
          executing.map((p, key: number) => (
            <Link to={`/proposal/${p.id}`}>{p.id}</Link>
          ))) || <div className="box">No executing proposals.</div>}
      </div>
    </div>
  );
};

export default Proposals;
