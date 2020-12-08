import React from "react";
import Proposal from "./Proposal";

const Proposals = (props: any) => {
  const { count, proposals } = props;

  const active = proposals.filter((p: any) => p.stage === "Active");
  const executing = proposals.filter((p: any) => p.exec);

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row">
        {(active.length &&
          active.map((p: any, key: number) => (
            <Proposal key={key} {...p} />
          ))) || <div className="box">No active proposals.</div>}
      </div>
      <div className="d-flex flex-row">
        {(executing.length &&
          executing.map((p: any, key: number) => (
            <Proposal key={key} {...p} />
          ))) || <div className="box">No executing proposals.</div>}
      </div>
    </div>
  );
};

export default Proposals;
