import React from "react";
import { Table } from "react-bootstrap";
import LeaderBoard from "./Leaderboard";
import CouncilVotes from "./CouncilVotes";
import Back from "../Back";
import { Member, ProposalDetail, Seat } from "../../types";

// TODO fetch from chain
const announcingPeriod = 28800;
const votingPeriod = 14400;
const revealingPeriod = 14400;
const termDuration = 144000;
const cycle = termDuration + announcingPeriod + votingPeriod + revealingPeriod; // 201600

const Rounds = (props: {
  block: number;
  members: Member[];
  councils: Seat[][];
  proposals: any;
  history: any;
}) => {
  const { block, councils, members, proposals } = props;
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
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {councils.map((council, i: number) => (
            <tr key={i} className="">
              <td>{i + 1}</td>
              <td>{1 + i * cycle}</td>
              <td>{28801 + i * cycle}</td>
              <td>{43201 + i * cycle}</td>
              <td>{57601 + i * cycle}</td>
              <td>{57601 + 201600 + i * cycle}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <LeaderBoard
        cycle={cycle}
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
                p.createdAt > 57601 + i * cycle &&
                p.createdAt < 57601 + (i + 1) * cycle
            )}
          />
        ))}
    </div>
  );
};

export default Rounds;
