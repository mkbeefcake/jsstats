import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Row from "./Row";
import NavBar from "./NavBar";
import Types from "./Types";
import { Member, Post, ProposalDetail, ProposalPost } from "../../types";

interface IProps {
  block: number;
  members: Member[];
  proposals: ProposalDetail[];
  proposalPosts: ProposalPost[];
  startTime: number;

  // author overlay
  councils: number[][];
  posts: Post[];
}
interface IState {
  author: string;
  key: any;
  asc: boolean;
  hidden: string[];
  showTypes: boolean;
}

class ProposalTable extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      key: "id",
      asc: false,
      hidden: [],
      author: "All",
      showTypes: false,
    };
    this.selectAuthor = this.selectAuthor.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
    this.toggleShowTypes = this.toggleShowTypes.bind(this);
  }

  setKey(key: string) {
    if (key === this.state.key) this.setState({ asc: !this.state.asc });
    else this.setState({ key });
  }

  toggleShowTypes() {
    this.setState({ showTypes: !this.state.showTypes });
  }
  toggleHide(type: string) {
    const isHidden = this.state.hidden.includes(type);
    const hidden = isHidden
      ? this.state.hidden.filter((h) => h !== type)
      : this.state.hidden.concat(type);
    this.setState({ hidden });
  }
  selectAuthor(event: any) {
    this.setState({ author: event.target.text });
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
    const { block, councils, members, posts, proposalPosts } = this.props;
    const { author, hidden } = this.state;

    // proposal types
    let types: { [key: string]: number } = {};
    this.props.proposals.forEach((p) => types[p.type]++);

    // authors
    let authors: { [key: string]: number } = {};
    this.props.proposals.forEach((p) => authors[p.author]++);

    const proposals = this.sortProposals(this.filterProposals());
    const approved = proposals.filter((p) => p.result === "Approved").length;

    // calculate finalization times
    const durations: any = proposals.map((p) =>
      p.finalizedAt
        ? p.finalizedAt - p.createdAt
        : (block && block - p.createdAt) || 0
    );

    // calculate mean voting duration
    const avgBlocks =
      durations.reduce((a: number, b: number) => a + b) / durations.length;
    const avgDays = Math.floor(avgBlocks / 14400);
    const avgHours = Math.floor((avgBlocks - avgDays * 14400) / 600);

    return (
      <div className="h-100 overflow-hidden bg-light">
        <NavBar
          author={author}
          authors={authors}
          selectAuthor={this.selectAuthor}
          toggleShowTypes={this.toggleShowTypes}
        />

        <Types
          hidden={hidden}
          show={this.state.showTypes}
          toggleHide={this.toggleHide}
          types={types}
        />

        <div className="d-flex flex-row justify-content-between p-2 bg-dark text-light text-left font-weight-bold">
          <div onClick={() => this.setKey("id")}>ID</div>
          <div className="col-2" onClick={() => this.setKey("author")}>
            Author
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
            <br />∅ {avgDays ? `${avgDays}d` : ""}
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
          style={{ height: `85%` }}
        >
          {proposals.map((p) => (
            <Row
              key={p.id}
              {...p}
              block={block}
              members={members}
              startTime={this.props.startTime}
              posts={proposalPosts.filter((post) => post.threadId === p.id)}
              councils={councils}
              forumPosts={posts}
              proposals={this.props.proposals}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default ProposalTable;
