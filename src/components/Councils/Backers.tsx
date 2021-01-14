import React from "react";
import { Backer, Member, Seat } from "../../types";
import SeatBackers from "./SeatBackers";

const CouncilBackers = (props: { councils: Seat[][]; members: Member[] }) => {
  const { councils, members } = props;

  const getHandle = (account: string) => {
    const member = members.find((m) => m.account === account);
    return member ? member.handle : account;
  };

  return (
    <div className="d-flex flex-row">
      {councils.map((council, round: number) => (
        <div key={round} className="box">
          <h2>Round {round + 1}</h2>
          {council.map((seat) => (
            <div
              key={`round-${round + 1}-seat-${seat.member}`}
              className="my-2"
            >
              <h3>{getHandle(seat.member)}</h3>
              Own stake: {seat.stake}
              <SeatBackers
                key={`backers-${seat.member}`}
                getHandle={getHandle}
                backers={seat.backers}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CouncilBackers;
