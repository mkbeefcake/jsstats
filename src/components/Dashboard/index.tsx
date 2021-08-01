import React from "react";
import { Link } from "react-router-dom";
import { Council } from "..";
import Forum from "./Forum";
import Proposals from "./Proposals";
import Validators from "../Validators";
import { IState } from "../../types";

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const Dashboard = (props: IProps) => {
  const {
    toggleStar,
    councils,
    handles,
    members,
    nominators,
    posts,
    proposals,
    rewardPoints,
    threads,
    tokenomics,
    status,
    stars,
    stashes,
    stakes,
    validators,
  } = props;

  return (
    <>
      <div className="w-100 flex-grow-1 d-flex align-items-center justify-content-center d-flex flex-column pb-5">
        <div className="back bg-warning d-flex flex-column p-2">
          <Link to="/calendar">Calendar</Link>
          <Link to="/curation">Curation</Link>
          <Link to="/timeline">Timeline</Link>
          <Link to="/tokenomics">Reports</Link>
          <Link to="/validators">Validators</Link>
          <Link to="/validator-report">Validator Report</Link>
          <Link to="/storage">Storage</Link>
          <Link to="/spending">Spending</Link>
          <Link to="/transactions">Transfers</Link>
          <Link to="/mint">Toolbox</Link>
        </div>

        <Council
          councils={councils}
          members={members}
          handles={handles}
          posts={posts}
          proposals={proposals}
          stars={stars}
          status={status}
          validators={validators}
        />

        <Proposals
          block={status.block ? status.block.id : 0}
          members={members}
          councils={councils}
          posts={posts}
          proposals={proposals}
          proposalPosts={props.proposalPosts}
          validators={validators}
          startTime={status.startTime}
        />

        <Forum
          handles={handles}
          posts={posts}
          threads={threads}
          startTime={status.startTime}
        />

        <Validators
          hideBackButton={true}
          toggleStar={toggleStar}
          councils={councils}
          handles={handles}
          members={members}
          posts={posts}
          proposals={proposals}
          nominators={nominators}
          validators={validators}
          stashes={stashes}
          stars={stars}
          stakes={stakes}
          rewardPoints={rewardPoints}
          tokenomics={tokenomics}
          status={status}
        />
      </div>
    </>
  );
};

export default Dashboard;
