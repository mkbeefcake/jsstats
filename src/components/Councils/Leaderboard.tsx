import React from "react";
import { Table } from "react-bootstrap";
import ConsulProposalVotes from "./ConsulRow";
import { Council, ProposalDetail } from "../../types";

interface ConsulTerms {
  handle: string;
  memberId: number;
  terms: Consul[];
  votes: number;
  percent: number;
}

const getConsulsTerms = (
  councils: Council[],
  proposals: ProposalDetail[]
): ConsulTerm[] => {
  // TODO from backend
  let consuls: { [key: string]: ConsulTerms[] } = {};

  councils
    .sort((a, b) => a.round - b.round)
    .forEach((council) => {
      council.consuls.forEach((term) => {
        const { memberId, member } = term;
        const { handle } = member;

        // update or create consul
        const [terms, votes] = consuls[handle]
          ? [
              consuls[handle].terms.concat(term),
              consuls[handle].votes + term.votes.length,
            ]
          : [[term], term.votes.length];
        const percent = proposals.length
          ? ((100 * votes) / proposals.length).toFixed()
          : 0;
        consuls[handle] = { handle, memberId, terms, votes, percent };
      });
    });
  return Object.values(consuls);
};

const LeaderBoard = (props: {
  proposals: ProposalDetail[];
  councils: Council[];
}) => {
  const { councils, proposals } = props;

  // prepare data to show:
  // - how often voted a consul per term (ProposalVote)
  // - stakes (own + voters) (CouncilVote)
  // council rounds as columns with consul`s votes per term as rows

  const consuls: ConsulTerms[] = getConsulsTerms(councils, proposals);
  const proposalsPerRound: number[] = councils
    .sort((a, b) => a.round - b.round)
    .map(
      ({ round }) => proposals.filter((p) => p.councilRound === round).length
    );

  return (
    <Table className={`text-light`}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Consul</th>
          <th>Total Votes</th>
          {councils.map((c, i: number) => (
            <th key={`round-${i + 1}`}>Round {1 + i}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {consuls
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 25)
          .map((c: ConsulTerms, rank: number) => (
            <ConsulProposalVotes
              key={c.handle}
              proposals={proposals.length}
              proposalsPerRound={proposalsPerRound}
              rank={rank}
              {...c}
            />
          ))}
        <tr>
          <td>Proposals</td>
          <td></td>
          <td>{proposals.length}</td>
          {proposalsPerRound.map((count: number, round: number) => (
            <td key={`round-${round}`}>{count}</td>
          ))}
        </tr>
      </tbody>
    </Table>
  );
};

export default LeaderBoard;
