import React from "react";
import { Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import SeatBackers from "./SeatBackers";
import { Member, ProposalDetail, Seat } from "../../types";

interface CouncilMember {
  handle: string;
  votes: number;
  proposalCount: number;
  percentage: number;
  seat: Seat;
}

interface CouncilVotes {
  proposalCount: number;
  members: CouncilMember[];
}

const LeaderBoard = (props: {
  proposals: ProposalDetail[];
  members: Member[];
  councils: Seat[][];
  stages: number[];
}) => {
  const { members, proposals, stages } = props;
  const councils = props.councils.filter((c) => c);
  const summarizeVotes = (handle: string, propList: ProposalDetail[]) => {
    let votes = 0;
    propList.forEach((p) => {
      if (!p || !p.votesByAccount) return;
      const vote = p.votesByAccount.find((v) => v.handle === handle);
      if (vote && vote.vote !== "") votes++;
    });
    return votes;
  };

  let councilMembers: Member[] = [];

  const councilVotes: CouncilVotes[] = councils
    .map(
      (council, i: number): CouncilVotes => {
        const start =
          stages[0] + stages[1] + stages[2] + stages[3] + i * stages[4];
        const end =
          stages[0] + stages[1] + stages[2] + stages[3] + (i + 1) * stages[4];
        const proposalsRound = proposals.filter(
          (p) => p && p.createdAt > start && p.createdAt < end
        );
        const proposalCount = proposalsRound.length;
        if (!proposalCount) return null;

        const members: CouncilMember[] = council.map(
          (seat): CouncilMember => {
            const member = props.members.find((m) => m.account === seat.member);
            if (!member)
              return {
                handle: ``,
                seat,
                votes: 0,
                proposalCount,
                percentage: 0,
              };

            councilMembers.find((m) => m.id === member.id) ||
              councilMembers.push(member);

            let votes = summarizeVotes(member.handle, proposalsRound);
            const percentage = Math.round((100 * votes) / proposalCount);
            return {
              handle: member.handle,
              seat,
              votes,
              proposalCount,
              percentage,
            };
          }
        );

        return { proposalCount, members };
      }
    )
    .filter((c) => c);

  councilMembers = councilMembers
    .map((m) => {
      return { ...m, id: summarizeVotes(m.handle, props.proposals) };
    })
    .sort((a, b) => b.id - a.id);

  return (
    <div className={`text-light m-3`}>
      <h2 className="w-100 text-center text-light">Votes per Council Member</h2>
      <Table className={`text-light`}>
        <thead>
          <tr>
            <th>Council Member</th>
            <th>Total Votes</th>
            {councilVotes.map((c, i: number) => (
              <th key={`round-${i + 1}`}>Round {1 + i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {councilMembers.map((member: Member) => (
            <MemberRow
              key={member.handle}
              member={member}
              members={members}
              votes={councilVotes}
            />
          ))}
          <tr>
            <td>Proposals</td>
            <td>{proposals.length}</td>
            {councilVotes.map((round, i: number) => (
              <td key={`round-${i + 1}`}>{round.proposalCount}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const MemberRow = (props: {
  member: Member;
  members: Member[];
  votes: CouncilVotes[];
}) => {
  const { votes, members } = props;
  const { handle } = props.member;
  let totalVotes = 0;
  let totalProposals = 0;

  votes.forEach((c) => {
    const m = c.members.find((member) => member.handle === handle);
    if (!m) return;
    totalVotes += m.votes;
    totalProposals += m.proposalCount;
  });

  const totalPercent = Math.round((100 * totalVotes) / totalProposals);

  return (
    <tr key={handle}>
      <td>{handle}</td>
      <td>
        {totalVotes} / {totalProposals} ({totalPercent}%)
      </td>
      {props.votes.map((c, round: number) => (
        <RoundVotes
          key={`round-${round + 1}-${handle}`}
          member={c.members.find((member) => member.handle === handle)}
          members={members}
        />
      ))}
    </tr>
  );
};

const RoundVotes = (props: { member?: CouncilMember; members: Member[] }) => {
  if (!props.member || props.member.handle === "") return <td />;
  const { votes, percentage, seat } = props.member;

  const getHandle = (account: string) => {
    const member = props.members.find((m) => m.account === account);
    return member ? member.handle : account;
  };

  return (
    <OverlayTrigger
      placement="left"
      overlay={
        <Tooltip id={seat.member}>
          <h4>Stakes</h4>
          <div className="d-flex flex-row justify-content-between">
            <div className="mr-2">Own</div>
            <div>{seat.stake}</div>
          </div>
          <SeatBackers backers={seat.backers} getHandle={getHandle} />
        </Tooltip>
      }
    >
      <td>
        {votes} ({percentage}%)
      </td>
    </OverlayTrigger>
  );
};

export default LeaderBoard;
