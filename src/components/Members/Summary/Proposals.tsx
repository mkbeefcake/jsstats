import React from "react";
import { Link } from "react-router-dom";

const Proposals = (props: {
  proposals: number;
  approved: number;
  pending: number;
}) => {
  const { approved, pending, proposals } = props;
  if (!proposals) return <div />;

  const count = proposals > 1 ? `${proposals} proposals` : `one proposal`;

  return (
    <div>
      Authored <Link to={`/proposals`}>{count}</Link>
      {approved
        ? `, ${approved} approved (${Math.round(
            (100 * approved) / proposals
          )}%)`
        : null}
      {pending ? `, ${pending} pending` : null}.
    </div>
  );
};

export default Proposals;
