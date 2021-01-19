import React, { Component } from "react";
import { Table } from "react-bootstrap";
import ProposalOverlay from "../Proposals/ProposalOverlay";
import VoteDiv from "./VoteDiv";
import { Member, ProposalDetail, Seat } from "../../types";

interface IProps {
  block: number;
  round: number;
  council: Seat[];
  members: Member[];
  proposals: ProposalDetail[];
  expand?: boolean;
}
interface IState {
  expand: boolean;
}

class CouncilVotes extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { expand: false };
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  componentDidMount() {
    const { expand } = this.props;
    if (expand) this.setState({ expand });
  }

  toggleExpand() {
    this.setState({ expand: !this.state.expand });
  }

  render() {
    const { block, council, members, proposals, round } = this.props;
    const { expand } = this.state;

    let councilMembers: Member[] = [];
    council.forEach((seat) => {
      const member = members.find((m) => m.account === seat.member);
      if (!member) return;
      councilMembers.push(member);
    });

    const fail = "btn btn-outline-danger";
    const styles: { [key: string]: string } = {
      Approved: "btn btn-success",
      Rejected: fail,
      Canceled: fail,
      Expired: fail,
      Pending: "btn btn-warning",
    };

    return (
      <Table className="text-light text-center">
        <thead onClick={this.toggleExpand}>
          <tr>
            <th className="text-right" style={{ width: "40%" }}>
              Round {round}
            </th>
            {councilMembers.map((member) => (
              <th key={member.handle} style={{ width: "10%" }}>
                {member.handle}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expand &&
            proposals
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((p) => (
                <tr key={p.id} className={`text-left`}>
                  <td
                    className={`float-right mt-1 p-0 px-1 ${styles[p.result]}`}
                  >
                    <ProposalOverlay block={block} {...p} />
                  </td>

                  {p.votesByAccount &&
                    council.map((seat) => (
                      <VoteDiv
                        key={seat.member}
                        votes={p.votesByAccount}
                        member={members.find((m) => m.account === seat.member)}
                      />
                    ))}
                </tr>
              ))}
        </tbody>
      </Table>
    );
  }
}

export default CouncilVotes;
