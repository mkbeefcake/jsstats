import React from "react";
import { Link } from "react-router-dom";
import Blocks from "./Blocks";
import { ActiveProposals, Council } from "..";
import Nominators from "./Nominators";
import Validators from "./Validators";
import { Block } from "../../types";

interface IProps {
  block: number;
  blocks: Block[];
  council: any;
  nominators: string[];
  validators: string[];
  proposals: any;
  proposalCount: number;
  domain: string;
}

const Dashboard = (props: IProps) => {
  return (
    <div className="w-100 flex-grow-1 d-flex align-items-center justify-content-center d-flex flex-column">
      <div className="title">
        <h1>
          <a href={props.domain}>Joystream</a>
        </h1>
      </div>
      <div className="box mt-3">
        <h3>latest block</h3>
        {props.block}
      </div>
      <div className="box">
        <h3>Active Proposals</h3>
        <ActiveProposals proposals={props.proposals} />
      </div>
      <Link to={"/council"}>
        <Council council={props.council} />
      </Link>
      <div className="d-flex flex-row">
        <Link to={"/validators"}>
          <Validators validators={props.validators} />
        </Link>
        <Link to={"/nominators"}>
          <Nominators nominators={props.nominators} />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
