import React from "react";
import { ActiveProposals, Council } from "..";
import Nominators from "./Nominators";
import Validators from "./Validators";
import { Block, Handles } from "../../types";

interface IProps {
  block: number;
  blocks: Block[];
  council: any;
  nominators: string[];
  validators: string[];
  proposals: any;
  proposalCount: number;
  domain: string;
  handles: Handles;
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
        <ActiveProposals block={props.block} proposals={props.proposals} />
      </div>
      <Council council={props.council} handles={props.handles} />
      <div className="d-flex flex-row">
        <Validators validators={props.validators} handles={props.handles} />
        <Nominators nominators={props.nominators} handles={props.handles} />
      </div>
    </div>
  );
};

export default Dashboard;
