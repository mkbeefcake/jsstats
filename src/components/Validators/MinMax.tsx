import React from "react";
import { Stakes } from "../../types";

const dollar = (d: number) => (d > 0 ? `$ ${d.toFixed(2)}` : "");

const MinMax = (props: {
  stakes?: { [key: string]: Stakes };
  issued: number;
  validators: number;
  nominators: number;
  waiting: number;
  reward: number;
  price: number;
}) => {
  const { issued, stakes, validators, waiting, reward, price } = props;
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
    <div className="float-right text-right d-none d-md-block">
      <div className="mb-2">
        <div>
          <div className="float-left mr-1">nominators:</div>
          {props.nominators}
        </div>
        <div>
          <div className="float-left mr-1">validators:</div>
          {validators}
        </div>
        <div>
          <div className="float-left mr-1">waiting:</div>
          {waiting}
        </div>
      </div>

      <b>total stake</b>
      <div className="mb-2">
        <div>{(sum / 1000000).toFixed(1)} M JOY</div>/{" "}
        {(issued / 1000000).toFixed(1)} M JOY
        <div>({((sum / issued) * 100).toFixed(1)}%)</div>
      </div>
      <div>
        <div className="float-left mr-1">min:</div> {minStake} JOY
      </div>
      <div>
        <div className="float-left mr-1">max:</div> {maxStake} JOY
      </div>

      <Reward reward={reward} price={price} validators={validators} />
    </div>
  );
};

const Reward = (props: {
  reward: number;
  price: number;
  validators: number;
}) => {
  const { reward, price, validators } = props;
  if (!reward) return <div />;

  return (
    <div className="mt-2">
      <b>total reward per hour</b>
      <div>{reward} JOY</div>
      <div>{dollar(price * reward)}</div>
      <div className="mt-2">per validator:</div>
      <div className="text-warning">
        {(reward / validators).toFixed(0)} JOY
        <div>{dollar((price * reward) / validators)}</div>
      </div>
    </div>
  );
};

export default MinMax;
