import React from "react";
import { Backer } from "../../types";

const SeatBackers = (props: { backers: Backer[] }) => {
  const { backers } = props;
  if (!backers.length) return <span />;

  return (
    <div>
      {backers
        .sort((a, b) => b.stake - a.stake)
        .map((backer) => (
          <div
            key={`${backer.consulId}-${backer.memberId}`}
            className="d-flex flex-row justify-content-between"
          >
            <div className="mr-2">{backer.member.handle}</div>
            <div>{backer.stake}</div>
          </div>
        ))}
    </div>
  );
};

export default SeatBackers;
