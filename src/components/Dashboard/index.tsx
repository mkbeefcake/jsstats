import React from "react";
import { Link } from "react-router-dom";
import { ActiveProposals, Council } from "..";
import Nominators from "./Nominators";
import Validators from "./Validators";
import Loading from "../Loading";
import { IState, Member } from "../../types";

const Dashboard = (props: IState) => {
  const { block, now, councils, domain, handles, members, proposals } = props;

  return (
    <div className="w-100 flex-grow-1 d-flex align-items-center justify-content-center d-flex flex-column">
      <div className="title">
        <h1>
          <a href={domain}>Joystream</a>
        </h1>
      </div>
      <div className="box mt-3">
        <h3>latest block</h3>
        {block ? block : <Loading />}
      </div>
      <div className="box">
        <h3>Active Proposals</h3>
        <ActiveProposals block={block} proposals={proposals} />
        <hr />
        <Link to={`/proposals`}>Show all</Link>
      </div>

      <Council
        councils={councils}
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
      <div className="d-flex flex-row">
        <Validators validators={props.validators} handles={handles} />
        <Nominators nominators={props.nominators} handles={handles} />
      </div>
    </div>
  );
};

export default Dashboard;
