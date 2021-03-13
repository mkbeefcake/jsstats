import React from "react";
import Head from "./TableHead";
import Row from "./Row";
import NavBar from "./NavBar";
import NavButtons from "./NavButtons";
import Types from "./Types";
import { Member, Post, ProposalDetail, ProposalPost, Seat } from "../../types";

const LIMIT = 10;

interface IProps {
  hideNav?: boolean;
  block: number;
  members: Member[];
  proposals: ProposalDetail[];
  proposalPosts: ProposalPost[];
  startTime: number;

  // author overlay
  councils: Seat[][];
  posts: Post[];
  validators: string[];
}
interface IState {
  author: string;
  key: any;
  asc: boolean;
  hidden: string[];
  showTypes: boolean;
  page: number;
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
      page: 1,
    };
    this.selectAuthor = this.selectAuthor.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
    this.toggleShowTypes = this.toggleShowTypes.bind(this);
    this.setPage = this.setPage.bind(this);
    this.setKey = this.setKey.bind(this);
  }

  setKey(key: string) {
    if (key === this.state.key) this.setState({ asc: !this.state.asc });
    else this.setState({ key });
  }

  setPage(page: number) {
    this.setState({ page });
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
    const {
      hideNav,
      block,
      councils,
      members,
      posts,
      proposalPosts,
    } = this.props;
    const { page, author, hidden } = this.state;

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
          show={!hideNav}
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

        <Head
          setKey={this.setKey}
          approved={approved}
          proposals={proposals.length}
          avgDays={avgDays}
          avgHours={avgHours}
        />
        <div className="d-flex flex-column overflow-auto p-2">
          {proposals.slice((page - 1) * LIMIT, page * LIMIT).map((p) => (
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
              validators={this.props.validators}
            />
          ))}
        </div>
        <NavButtons
          setPage={this.setPage}
          page={page}
          limit={LIMIT}
          proposals={proposals.length}
        />
      </div>
    );
  }
}

export default ProposalTable;
