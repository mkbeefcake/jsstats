import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
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
      <div className="h-100 overflow-hidden">
        <div className="">
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
        </div>

        <div className="d-flex flex-row justify-content-between p-2 bg-dark text-light text-left font-weight-bold">
          <div onClick={() => this.setKey("id")}>ID</div>
          <div className="col-2" onClick={() => this.setKey("author")}>
            Author
            <br />
            <select value={author} onChange={this.selectAuthor}>
              <option>All</option>
              {Object.keys(authors).map((author: string) => (
                <option key={author}>{author}</option>
              ))}
            </select>
          </div>
          <div className="col-3" onClick={() => this.setKey("description")}>
            Description
          </div>
          <div className="col-2" onClick={() => this.setKey("type")}>
            Type
          </div>
          <div className="col-1 text-center">
            Result
            <br />
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id={`approved`}>
                  {approved} of {proposals.length} approved
                </Tooltip>
              }
            >
              <div>{Math.floor(100 * (approved / proposals.length))}%</div>
            </OverlayTrigger>
          </div>
          <div className="col-2">
            Voting Duration
            <br />
            Average: {avgDays ? `${avgDays}d` : ""}
            {avgHours ? `${avgHours}h` : ""}
          </div>
          <div className="col-1" onClick={() => this.setKey("createdAt")}>
            Created
          </div>
          <div className="col-1" onClick={() => this.setKey("finalizedAt")}>
            Finalized
          </div>
        </div>

        <div
          className="d-flex flex-column overflow-auto p-2"
          style={{ height: `75%` }}
        >
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
        </div>
      </div>
    );
  }
}

export default ProposalTable;
