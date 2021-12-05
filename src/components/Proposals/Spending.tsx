import React from "react";
import { Link } from "react-router-dom";
import { IState, ProposalDetail } from "../../types";
import { domain } from "../../config";

const mJoy = (amount: number) => (amount ? (amount / 1000000).toFixed(2) : `?`);

const executionFailed = (result: string, executed: any) => {
  if (result !== "Approved") return result;
  if (!executed || !Object.keys(executed)) return;
  if (executed.Approved && executed.Approved.ExecutionFailed)
    return executed.Approved.ExecutionFailed.error;
  return false;
};

const Spending = (props: IState) => {
  const spending = props.proposals.filter(
    (p: ProposalDetail) => p && p.type === "spending"
  );
  console.log(`Found ${spending.length} spending proposals.`);
  console.log(spending);

  const rounds: ProposalDetail[][] = [];
  let unknown = 0;
  let sum = 0;
  let sums: number[] = [];
  spending.forEach((p) => {
    const r = p.councilRound;
    rounds[r] = rounds[r] ? rounds[r].concat(p) : [p];
    if (!sums[r]) sums[r] = 0;
    if (executionFailed(p.result, p.executed)) return;
    sum += p.amount;
    sums[r] += p.amount;
  });

  return (
    <div className="box text-left">
      <h1 className="text-left">Total: {mJoy(sum)}M tJOY</h1>
      {rounds.length
        ? rounds.map((proposals, i: number) => (
            <div key={`round-${i}`} className="bg-secondary p-1 my-2">
              <h2 className="text-left mt-3">
                Round {i} <small>{mJoy(sums[i])} M</small>
              </h2>
              {proposals.map((p) => (
                <ProposalLine key={p.id} {...p} />
              ))}
            </div>
          ))
        : spending
            .sort((a, b) => b.id - a.id)
            .map((p) => <ProposalLine key={p.id} {...p} />)}
    </div>
  );
};

export default Spending;

const ProposalLine = (props: any) => {
  const { id, title, amount, author, executed, result } = props;
  const failed = executionFailed(result, executed);
  const color = failed
    ? failed === "Pending"
      ? "warning"
      : "danger"
    : "success";
  return (
    <div key={id} className={`bg-${color} d-flex flex-row`}>
      <div className={`col-1 text-right bg-${color} text-body p-1 mr-2`}>
        {mJoy(amount)} M
      </div>
      <a className="col-1" href={`${domain}/#/proposals/${id}`}>
        {id}
      </a>
      <Link className="col-1" to={`/members/${author.handle}`}>
        {author.handle}
      </Link>
      <Link className="col-4" to={`/proposals/${id}`}>
        {title}
      </Link>
    </div>
  );
};
