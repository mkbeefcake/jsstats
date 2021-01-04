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
  author: string;
  key: any;
  asc: boolean;
  hidden: string[];
}

class ProposalTable extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { key: "id", asc: false, hidden: [], author: "All" };
    this.selectAuthor = this.selectAuthor.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
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
  selectAuthor(event: any) {
    this.setState({ author: event.target.value });
  }

  filterProposals() {
    const proposals = this.props.proposals.filter(
      (p) => !this.state.hidden.find((h) => h === p.type)
    );
    const { author } = this.state;
    if (author === "All") return proposals;
    return proposals.filter((p) => p.author === author);
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
    const { author, hidden } = this.state;

    // proposal types
    let types: { [key: string]: number } = {};
    this.props.proposals.forEach((p) => types[p.type]++);

    // authors
    let authors: { [key: string]: number } = {};
    this.props.proposals.forEach((p) => authors[p.author]++);

    const proposals = this.sortProposals(this.filterProposals());

    const approved = proposals.filter((p) => p.result === "Approved").length;

    return (
      <Table>
        <thead>
          <tr className="bg-dark text-light font-weight-bold">
            <td onClick={() => this.setKey("id")}>ID</td>
            <td onClick={() => this.setKey("author")}>
              Author
              <br />
              <select value={author} onChange={this.selectAuthor}>
                <option>All</option>
                {Object.keys(authors).map((author: string) => (
                  <option key={author}>{author}</option>
                ))}
              </select>
            </td>
            <td
              onClick={() => this.setKey("description")}
              className="text-right"
            >
              Description
            </td>
            <td onClick={() => this.setKey("type")}>Type</td>
            <td>
              Votes
              <br />
              {approved}/{proposals.length}
            </td>
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
