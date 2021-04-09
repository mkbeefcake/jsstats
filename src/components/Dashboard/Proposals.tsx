import React from "react";
import { Link } from "react-router-dom";
import ProposalsTable from "../Proposals/ProposalTable";
import Loading from "../Loading";

const Proposals = (props: { proposals; validators; councils; members }) => {
  const { proposals, validators, councils, members, posts, startTime } = props;

  const pending = proposals.filter((p) => p && p.result === "Pending");
  if (!proposals.length) return <Loading target="proposals" />;
  if (!pending.length) {
    const loading = proposals.filter((p) => !p);
    return loading.length ? (
      <Loading />
    ) : (
      <div className="box">No active proposals.</div>
    );
  }
  return (
    <div className="w-100 p-3 m-3">
      <div className="d-flex flex-row">
        <h3 className="ml-1 text-light">Active Proposals</h3>
        <Link className="m-3 text-light" to={"/proposals"}>
          All
        </Link>
        <Link className="m-3 text-light" to={"/spending"}>
          Spending
        </Link>
        <Link className="m-3 text-light" to={"/councils"}>
          Votes
        </Link>
      </div>
      <ProposalsTable
        hideNav={true}
        proposals={pending}
        proposalPosts={props.proposalPosts}
        members={members}
        councils={councils}
        posts={posts}
        startTime={startTime}
        validators={validators}
      />
    </div>
  );
};

export default Proposals;
