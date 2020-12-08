import React from "react";
import Proposal from "./ProposalOverlay";

const ActiveProposals = (props: any) => {
  const active = props.proposals.filter((p: any) => p.stage === "Active");
  if (!active.length) return <div className="box">No active proposals.</div>;
  return active.map((p: any, key: number) => <Proposal key={key} {...p} />);
};

export default ActiveProposals;
