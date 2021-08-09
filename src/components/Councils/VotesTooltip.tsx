import React from "react";
import { InfoTooltip } from "..";
import { Consul } from "../../types";
import Voters from "./SeatBackers";

// display stakes tooltip and votes and percentage of proposals voted on

const VotesTooltip = (props: Consul) => {
  const { member, stake, votes, voters, proposals = 0 } = props;
  const percent = proposals ? ((100 * votes.length) / proposals).toFixed() : 0;
  const totalStake = voters.reduce((a, b) => a + b.stake, stake);
  const tag = proposals ? `${votes.length} (${percent}%)` : `-`;

  return (
    <InfoTooltip
      placement="bottom"
      id={`stakes-${member.handle}`}
      title={
        <>
          <h4>Stakes: {(totalStake / 1000000).toFixed(1)} M</h4>
          <div className="d-flex flex-row justify-content-between">
            <div className="mr-2">Own</div>
            <div>{stake}</div>
          </div>
          <Voters backers={voters} />
        </>
      }
    >
      <td>{tag}</td>
    </InfoTooltip>
  );
};

export default VotesTooltip;
