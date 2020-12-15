import React from "react";
import { Link } from "react-router-dom";
import { ActiveProposals, Council } from "..";
import Nominators from "./Nominators";
import Validators from "./Validators";
import { IState } from "../../types";
import Loading from "../Loading";

const Dashboard = (props: IState) => {
  const { block, council, domain, handles, proposals } = props;

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
        council={council}
        handles={handles}
        councilElection={props.councilElection}
        block={block}
      />
      <div className="d-flex flex-row">
        <Validators validators={props.validators} handles={handles} />
        <Nominators nominators={props.nominators} handles={handles} />
      </div>
    </div>
  );
};

export default Dashboard;
