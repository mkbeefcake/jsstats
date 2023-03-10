import React from "react";
import User from "../User";
import { Stake } from "../../types";

const Reward = (reward: number) =>
  reward > 0 ? (
    <span className="text-warning mx-1">+{reward.toFixed(0)}</span>
  ) : (
    <span />
  );

const Nominators = (props: {
  fNum: (n: number) => string;
  sortBy: (field: string) => void;
  toggleExpand: () => void;
  expand: boolean;
  nominators?: Stake[];
  reward: number;
}) => {
  const { fNum, sortBy, nominators, reward } = props;

  if (!nominators || !nominators.length) return <div />;

  let sum: number = 0;
  nominators.forEach((n) => (sum += n.value));

  return (
    <table className="text-center" onClick={() => sortBy("othersStake")}>
      <tbody>
        {nominators.length > 1 && (
          <tr>
            <td className="text-right" style={{ width: "75px" }}>
              {fNum(sum)}
            </td>
            <td className="text-right" style={{ width: "40px" }}>
              {Reward(reward)}
            </td>
          </tr>
        )}
        {nominators
          .sort((a, b) => b.value - a.value)
          .map((n) => (
            <tr key={n.who}>
              <td className="text-right" style={{ width: "75px" }}>
                {fNum(n.value)}
              </td>
              <td className="text-right" style={{ width: "40px" }}>
                {Reward(reward * (n.value / sum))}
              </td>
              <td>
                <User id={n.who} handle={n.member?.handle || n.who} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Nominators;
