import React from "react";
import Blocks from "./Blocks";
import Council from "../Council";
import Nominators from "./Nominators";
import Validators from "./Validators";
import { Block } from "../../types";

interface IProps {
  block: number;
  blocks: Block[];
  council: any;
  nominators: string[];
  validators: string[];
  domain: string;
}

const Dashboard = (props: IProps) => {
  const { domain, block, blocks, council, nominators, validators } = props;
  
  return (
    <div className="w-100 h-80 position-fixed flex-grow-1 d-flex align-items-center justify-content-center d-flex flex-column">
    <h1><a href={`${domain}`}>Joystream</a></h1>
      <div className='box'>
        <h3>latest block</h3>
        {block}
      </div>
      <Blocks blocks={blocks} />
      <Council council={council} />
      <div className="d-flex flex-row">
      <Validators validators={validators} />
      <Nominators nominators={nominators} />
      </div>
    </div>
  );
};

export default Dashboard;
