import React from "react";
import { Backer } from "../../types";

const SeatBackers = (props: {
  getHandle: (account: string) => string;
  backers: Backer[];
}) => {
  const { getHandle, backers } = props;
  if (!backers.length) return <span />;

  return (
    <div>
      {backers.map((backer) => (
        <div
          key={`${backer.member}-${backer.stake}`}
          className="d-flex flex-row justify-content-between"
        >
          <div className="mr-2">{getHandle(backer.member)}</div>
          <div>{backer.stake}</div>
        </div>
      ))}
    </div>
  );
};

export default SeatBackers;
