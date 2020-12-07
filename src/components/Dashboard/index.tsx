import React from "react";
import Blocks from "./Blocks";
import Nominators from "./Nominators";
import Validators from "./Validators";
import { Block } from "../../types";

interface IProps {
  block: number;
  blocks: Block[];
  nominators: string[];
  validators: string[];
}

const Dashboard = (props: IProps) => {
  const { block, blocks, nominators, validators } = props;

  return (
    <div className="w-100 h-100 d-flex flex-grow-1 align-items-center justify-content-center d-flex flex-column">
      <div>
        <h3>latest block</h3>
        <h2>{block}</h2>
      </div>
      <Blocks blocks={blocks} />
      <Validators validators={validators} />
      <Nominators nominators={nominators} />
    </div>
  );
};

export default Dashboard;
