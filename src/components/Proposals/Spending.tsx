import React from "react";
import { Link } from "react-router-dom";
import { IState, ProposalDetail } from "../../types";
import Back from "../Back";

const amount = (amount: number) => (amount / 1000000).toFixed(2);

const getRound = (block: number): number =>
  Math.round((block - 57600) / 201600);

const executionFailed = (result: string, executed: any) => {
  if (result !== "Approved") return result;
  if (!executed || !Object.keys(executed)) return;
  if (executed.Approved.ExecutionFailed)
    return executed.Approved.ExecutionFailed.error;
  return false;
};

const Spending = (props: IState) => {
  const spending = props.proposals.filter(
    (p: ProposalDetail) => p && p.type === "spending"
  );

  const rounds: ProposalDetail[][] = [];
  let unknown = 0;
  let sum = 0;
  let sums: number[] = [];
  spending.forEach((p) => {
    const r = getRound(p.finalizedAt);
    rounds[r] = rounds[r] ? rounds[r].concat(p) : [p];
    if (!sums[r]) sums[r] = 0;
    if (!p.detail) return unknown++;
    if (executionFailed(p.result, p.executed)) return;
    sum += p.detail.Spending[0];
    sums[r] += p.detail.Spending[0];
  });

  return (
    <div className="box text-left">
      <div className="back position-fixed">
        <Back history={props.history} />
      </div>
      <h1 className="text-left">
        Total: {amount(sum)}
        {unknown ? `*` : ``} M tJOY
      </h1>
      {unknown ? `* subject to change until all details are available` : ``}
      {rounds.map((proposals, i: number) => (
        <div key={`round-${i}`} className="bg-secondary p-1 my-2">
          <h2 className="text-left mt-3">
            Round {i} <small>{amount(sums[i])} M</small>
          </h2>
          {proposals.map((p) => (
            <ProposalLine key={p.id} {...p} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Spending;

const ProposalLine = (props: any) => {
  const { id, title, detail, author, executed, result } = props;
  const failed = executionFailed(result, executed);
  return (
    <div key={id} className={failed ? "bg-danger" : "bg-warn"}>
      <span
        className={`bg-${failed ? "danger" : "warning"} text-body p-1 mr-2`}
      >
        {detail ? amount(detail.Spending[0]) : `?`} M
      </span>
      <Link to={`/proposals/${id}`}>{title}</Link> (
      <Link to={`/members/${author}`}>{author}</Link>)
      {failed ? ` - ${failed}` : ""}
    </div>
  );
};
