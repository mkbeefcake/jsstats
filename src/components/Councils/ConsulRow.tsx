import React from "react";
import VotesTooltip from "./VotesTooltip";
import { Consul } from "../../types";

// display number of votes per term

const ConsulProposalVotes = (props: {
  handle: string;
  percent: number;
  proposalsPerRound: number[];
  rank: number;
  terms: Consul[];
}) => {
  const { handle, percent, proposals, rank, terms, votes } = props;

  // associate terms to rounds
  let rounds: Consul[] = [];
  for (let round = 0; round < props.proposalsPerRound.length; round++) {
    const term = terms.find((t) => t.councilRound === round + 1);
    rounds[round] = term || null;
  }

  return (
    <tr key={handle}>
      <td>{rank + 1}</td>
      <td>{handle}</td>
      <td>
        {votes} / {proposals} ({percent}%)
      </td>
      {rounds.map((term, round: number) =>
        term ? (
          <VotesTooltip
            key={`votes-${handle}-${term.councilRound}`}
            proposals={props.proposalsPerRound[term.councilRound - 1]}
            {...term}
          />
        ) : (
          <td key={`votes-${handle}-${round + 1}`} />
        )
      )}
    </tr>
  );
};

export default ConsulProposalVotes;
