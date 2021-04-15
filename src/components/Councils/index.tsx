import React from "react";
import { Table } from "react-bootstrap";
import LeaderBoard from "./Leaderboard";
import CouncilVotes from "./CouncilVotes";
import Back from "../Back";
import { Member, ProposalDetail, Seat, Status } from "../../types";

const Rounds = (props: {
  block: number;
  members: Member[];
  councils: Seat[][];
  proposals: any;
  history: any;
  status: Status;
}) => {
  const { block, councils, members, proposals, status } = props;
  if (!status.council) return <div />;
  const stage = status.council.durations;
  return (
    <div className="w-100">
      <div className="position-fixed" style={{ right: "0", top: "0" }}>
        <Back history={props.history} />
      </div>
      <Table className="w-100 text-light">
        <thead>
          <tr>
            <th>Round</th>
            <th>Announced</th>
            <th>Voted</th>
            <th>Revealed</th>
            <th>Term start</th>
            <th>Term end</th>
          </tr>
        </thead>
        <tbody>
          {councils.map((council, i: number) => (
            <tr key={i + 1}>
              <td>{i + 1}</td>
              <td>{1 + i * stage[4]}</td>
              <td>{stage[0] + i * stage[4]}</td>
              <td>{stage[0] + stage[1] + i * stage[4]}</td>
              <td>{stage[0] + stage[2] + stage[3] + i * stage[4]}</td>
              <td>
                {stage[0] + stage[1] + stage[2] + stage[3] + +i * stage[4]}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <LeaderBoard
        stages={stage}
        councils={councils}
        members={members}
        proposals={proposals}
      />

      <h2 className="w-100 text-center text-light">Votes per Council</h2>
      {councils
        .filter((c) => c)
        .map((council, i: number) => (
          <CouncilVotes
            key={i}
            expand={i === councils.length - 1}
            block={block}
            round={i + 1}
            council={council}
            members={props.members}
            proposals={props.proposals.filter(
              (p: ProposalDetail) =>
                p &&
                p.createdAt >
                  stage[0] + stage[1] + stage[2] + stage[3] + i * stage[4] &&
                p.createdAt <
                  stage[0] + stage[1] + stage[2] + stage[3] + (i + 1) * stage[4]
            )}
          />
        ))}
    </div>
  );
};

export default Rounds;
