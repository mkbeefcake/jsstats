import React from "react";
import User from "../User";
import { Handles, Stake } from "../../types";

// TODO use MemberBox after refactor

const Nominators = (props: {
  sortBy: (field: string) => void;
  toggleExpand: () => void;
  expand: boolean;
  handles: Handles;
  nominators?: Stake[];
}) => {
  const { sortBy, toggleExpand, expand, handles, nominators } = props;

  if (!nominators || !nominators.length) return <div />;

  let sum: number = 0;
  nominators.forEach((n) => (sum += n.value));

  if (nominators.length === 1)
    return (
      <div className="d-flex flex-row">
        <div onClick={() => sortBy("othersStake")}>{nominators[0].value}</div>
        <User id={nominators[0].who} handle={handles[nominators[0].who]} />
      </div>
    );

  if (expand)
    return (
      <div>
        <span onClick={() => sortBy("othersStake")}>{sum}</span>
        <span onClick={toggleExpand}> -</span>
        {nominators.map((n) => (
          <div key={n.who} className="d-flex flex-row">
            <div>{n.value}</div>
            <User id={n.who} handle={handles[n.who]} />
          </div>
        ))}
      </div>
    );

  return (
    <div>
      <span onClick={() => sortBy("othersStake")}> {sum}</span>
      {nominators
        .sort((a, b) => b.value - a.value)
        .map((n) => (
          <User key={n.who} id={n.who} handle={handles[n.who]} />
        ))}
      <span onClick={toggleExpand}> +</span>
    </div>
  );
};

export default Nominators;
