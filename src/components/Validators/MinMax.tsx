import React from "react";
import { Stakes } from "../../types";

const MinMax = (props: {
  stakes?: { [key: string]: Stakes };
  issued: number;
  validators: number;
  nominators: number;
  waiting: number;
}) => {
  const { issued, stakes, validators, nominators, waiting } = props;
  if (!stakes || !Object.values(stakes).length) return <span />;

  let sum = 0;
  let minStake: number = 10000000;
  let maxStake: number = 0;
  Object.values(stakes).forEach((s: Stakes) => {
    if (s.total > 0) sum += s.total;
    else return;

    if (s.total > maxStake) maxStake = s.total;
    if (s.total < minStake) minStake = s.total;
  });

  return (
    <div className="float-right text-right">
      <div className="mb-2">
        <div>
          <div className="float-left mr-1">validators:</div>
          {validators}
        </div>
        <div>
          <div className="float-left mr-1">nominators:</div>
          {nominators}
        </div>
        <div>
          <div className="float-left mr-1">waiting:</div>
          {waiting}
        </div>
      </div>

      <b>total stake</b>
      <div className="mb-2">
        <div>{Math.floor(sum / 100000) / 10} M JOY</div>/{" "}
        {Math.floor(issued / 100000) / 10} M JOY
        <div>({Math.floor((sum / issued) * 1000) / 10}%)</div>
      </div>
      <div>
        <div className="float-left mr-1">min:</div> {minStake} JOY
      </div>
      <div>
        <div className="float-left mr-1">max:</div> {maxStake} JOY
      </div>
    </div>
  );
};

export default MinMax;
