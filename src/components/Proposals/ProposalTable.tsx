import React from "react";
import { Button, Table } from "react-bootstrap";
import Row from "./Row";

import { Member, ProposalDetail, ProposalPost } from "../../types";

interface IProps {
  avgDays: number;
  avgHours: number;
  block: number;
  members: Member[];
  proposals: ProposalDetail[];
  proposalPosts: ProposalPost[];
  startTime: number;
}
interface IState {
  key: any;
  asc: boolean;
  hidden: string[];
}

class ProposalTable extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { key: "id", asc: false, hidden: [] };
  }

  setKey(key: string) {
    console.log(key);
    if (key === this.state.key) this.setState({ asc: !this.state.asc });
    else this.setState({ key });
  }

  toggleHide(type: string) {
    const isHidden = this.state.hidden.includes(type);
    const hidden = isHidden
      ? this.state.hidden.filter((h) => h !== type)
      : this.state.hidden.concat(type);
    this.setState({ hidden });
  }

  filterProposals() {
    const proposals = this.props.proposals.filter(
      (p) => !this.state.hidden.find((h) => h === p.type)
    );
    return proposals;
  }
  sortProposals(list: ProposalDetail[]) {
    const { asc, key } = this.state;
    if (key === "id" || key === "createdAt" || key === "finalizedAt")
      return list.sort((a: any, b: any) =>
        asc ? a[key] - b[key] : b[key] - a[key]
      );
    return list.sort((a: any, b: any) =>
      asc ? (a[key] < b[key] ? -1 : 1) : a[key] < b[key] ? 1 : -1
    );
  }

  render() {
    const { avgDays, avgHours, block, members, proposalPosts } = this.props;
    const { hidden } = this.state;

    // proposal types
    let types: { [key: string]: number } = {};
    this.props.proposals.forEach((p) => types[p.type]++);

    const proposals = this.sortProposals(this.filterProposals());

    return (
      <Table>
        <thead>
          <tr className="bg-dark text-light font-weight-bold">
            <td onClick={() => this.setKey("id")}>ID</td>
            <td onClick={() => this.setKey("author")}>Author</td>
            <td
              onClick={() => this.setKey("description")}
              className="text-right"
            >
              Description
            </td>
            <td onClick={() => this.setKey("type")}>Type</td>
            <td>Votes</td>
            <td>
              Voting Duration
              <br />
              Average: {avgDays ? `${avgDays}d` : ""}{" "}
              {avgHours ? `${avgHours}h` : ""}
            </td>
            <td onClick={() => this.setKey("createdAt")} className="text-right">
              Created
            </td>
            <td
              onClick={() => this.setKey("finalizedAt")}
              className="text-left"
            >
              Finalized
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8}>
              {Object.keys(types).map((type) => (
                <Button
                  key={type}
                  variant={hidden.includes(type) ? "outline-dark" : "dark"}
                  className="btn-sm m-1"
                  onClick={() => this.toggleHide(type)}
                >
                  {type}
                </Button>
              ))}
            </td>
          </tr>
          {proposals.map((p) => (
            <Row
              key={p.id}
              {...p}
              block={block}
              members={members}
              startTime={this.props.startTime}
              posts={proposalPosts.filter((post) => post.threadId === p.id)}
            />
          ))}
        </tbody>
      </Table>
    );
  }
}

export default ProposalTable;
