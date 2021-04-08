import React from "react";
import { Link } from "react-router-dom";
import { ActiveProposals, Council } from "..";
import Validators from "../Validators";
import { IState } from "../../types";

const Dashboard = (props: IState) => {
  const { block, now, domain, handles, members, proposals, tokenomics } = props;
  return (
    <div className="w-100 flex-grow-1 d-flex align-items-center justify-content-center d-flex flex-column">
      <div className="box position-abasolute" style={{ top: "0", right: "0" }}>
        <Link to="/mint">Tools</Link>
      </div>

      <div className="title">
        <h1>
          <a href={domain}>Joystream</a>
        </h1>
      </div>

      <div className="box">
        <h3>Forum</h3>
        <Link to="/forum">
          {props.posts.length} posts in {props.threads.length} threads
        </Link>
      </div>

      <div className="box">
        <h3>Active Proposals</h3>
        <ActiveProposals block={block} proposals={proposals} />
        <hr />
        <Link to={`/proposals`}>Show all</Link>
      </div>

      <Council
        councils={props.councils}
        members={members}
        councilElection={props.councilElection}
        block={block}
        now={now}
        round={props.round}
        handles={props.handles}
        termEndsAt={props.termEndsAt}
        stage={props.stage}
        posts={props.posts}
        proposals={props.proposals}
        validators={props.validators}
      />

      <Validators
        block={block}
        era={props.era}
        now={now}
        lastReward={props.lastReward}
        councils={props.councils}
        handles={handles}
        members={members}
        posts={props.posts}
        proposals={props.proposals}
        nominators={props.nominators}
        validators={props.validators}
        stashes={props.stashes}
        stars={props.stars}
        stakes={props.stakes}
        save={props.save}
        rewardPoints={props.rewardPoints}
        issued={tokenomics ? Number(tokenomics.totalIssuance) : 0}
        price={tokenomics ? Number(tokenomics.price) : 0}
      />
    </div>
  );
};

export default Dashboard;
