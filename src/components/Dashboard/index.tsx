import React from "react";
import { Link } from "react-router-dom";
import { Council } from "..";
import Forum from "./Forum";
import Proposals from "./Proposals";
import Footer from "./Footer";
import Status from "./Status";
import Validators from "../Validators";
import { IState } from "../../types";

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const Dashboard = (props: IProps) => {
  const {
    toggleStar,
    toggleFooter,
    hideFooter,
    councils,
    domain,
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
  const userLink = `${domain}/#/members/joystreamstats`;

  //console.log(`status`, status);

  return (
    <div className="w-100 flex-grow-1 d-flex align-items-center justify-content-center d-flex flex-column">
      <div className="back bg-warning d-flex flex-column p-2">
        <Link to={`/calendar`}>Calendar</Link>
        <Link to={`/timeline`}>Timeline</Link>
        <Link to={`/tokenomics`}>Reports</Link>
        <Link to={`/validators`}>Validators</Link>
        <Link to="/mint">Toolbox</Link>
      </div>

      <h1 className="title">
        <a href={domain}>Joystream</a>
      </h1>

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
        members={members}
        councils={councils}
        posts={posts}
        proposals={proposals}
        proposalPosts={props.proposalPosts}
        validators={validators}
      />

      <Forum posts={posts} threads={threads} startTime={status.startTime} />

      <div className="w-100 p-3 m-3">
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

      <Footer
        show={!hideFooter}
        toggleHide={toggleFooter}
        connecting={status.connecting}
        link={userLink}
      />
      <Status connecting={status.connecting} loading={status.loading} />
    </div>
  );
};

export default Dashboard;
