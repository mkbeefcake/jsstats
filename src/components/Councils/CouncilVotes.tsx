import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { ProposalOverlay, VoteButton } from "..";
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
    const { block, round, consuls, proposals } = this.props;
    const { expand } = this.state;

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
            <th className="text-left" colSpan={consuls.length - 1}>
              Round {round}
            </th>
            <th className="text-right" colSpan={2}>
              {proposals.length} Proposals
            </th>
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

                  {consuls.map((c) => {
                    const { handle } = c.member;
                    if (!p.votes) return <td key={handle} />;
                    const vote = p.votes.find(
                      ({ member }) => member.handle === handle
                    );
                    if (!vote) return <td key={handle} />;
                    return (
                      <td key={handle}>
                        <VoteButton handle={handle} vote={vote.vote} />
                      </td>
                    );
                  })}
                </tr>
              ))}
        </tbody>
      </Table>
    );
  }
}

export default CouncilVotes;
