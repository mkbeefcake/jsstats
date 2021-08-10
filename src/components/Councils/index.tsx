import React from "react";
import LeaderBoard from "./Leaderboard";
import CouncilVotes from "./CouncilVotes";
import Terms from "./TermLengths";
import { Loading } from "..";

import { Council, ProposalDetail, Status } from "../../types";

const Rounds = (props: {
  block: number;
  councils: Council[];
  proposals: ProposalDetail[];
  status: Status;
}) => {
  const { block, councils, proposals, status } = props;
  if (!status.election) return <Loading target="election status" />;
  const stage: number[] = status.election.durations;

  return (
    <div className="w-100">
      <h2 className="w-100 text-center text-light">Leaderboard</h2>
      <LeaderBoard
        stages={status.election?.stage}
        councils={councils}
        proposals={proposals}
        status={status}
      />

      <h2 className="w-100 text-center text-light">Proposal Votes</h2>
      {council
        .sort((a, b) => b.round - a.round)
        .map((council) => (
          <CouncilVotes
            key={council.round}
            {...council}
            expand={council.round === councils.length}
            block={block}
            proposals={proposals.filter(
              ({ councilRound }) => councilRound === council.round
            )}
          />
        ))}

      <h2 className="w-100 text-center text-light">Term Durations</h2>
      <Terms councils={councils} stage={stage} />
    </div>
  );
};

export default Rounds;
