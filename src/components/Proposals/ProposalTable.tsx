import React from "react";
import { Spinner } from "..";
import Head from "./TableHead";
import Row from "./Row";
import NavBar from "./NavBar";
import NavButtons from "./NavButtons";
import Types from "./Types";
import { Council, Member, Post, ProposalDetail, Status } from "../../types";

interface IProps {
  hideNav?: boolean;
  block: number;
  members: Member[];
  proposals: ProposalDetail[];
  status: Status;

  // author overlay
  councils: Council[];
  posts: Post[];
  validators: string[];
}
interface IState {
  author: string;
  key: any;
  asc: boolean;
  selectedTypes: string[];
  showTypes: boolean;
  page: number;
}

class ProposalTable extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      key: "id",
      asc: false,
      selectedTypes: [],
      author: "",
      showTypes: false,
      page: 1,
      perPage: 10,
    };
    this.selectAuthor = this.selectAuthor.bind(this);
    this.toggleShowType = this.toggleShowType.bind(this);
    this.toggleShowTypes = this.toggleShowTypes.bind(this);
    this.setPage = this.setPage.bind(this);
    this.setPerPage = this.setPerPage.bind(this);
    this.setKey = this.setKey.bind(this);
  }

  setKey(key: string) {
    if (key === this.state.key) this.setState({ asc: !this.state.asc });
    else this.setState({ key });
  }

  setPage(page: number) {
    this.setState({ page });
  }
  setPerPage(perPage: number) {
    this.setState({ perPage });
  }
  toggleShowTypes() {
    this.setState({ showTypes: !this.state.showTypes });
  }
  toggleShowType(type: string) {
    const selected = this.state.selectedTypes.includes(type);
    const selectedTypes = selected
      ? this.state.selectedTypes.filter((t) => t !== type)
      : this.state.selectedTypes.concat(type);
    this.setState({ selectedTypes });
  }
  selectAuthor(event: any) {
    console.log(event);
    this.setState({ author: event.target.text });
  }

  filterProposals(proposals = this.props.proposals) {
    return this.filterByAuthor(this.filterByType(proposals));
  }
  filterByAuthor(proposals, author = this.state.author) {
    return author.length
      ? proposals.filter((p) => p.author.handle === author)
      : proposals;
  }
  filterByType(proposals, types = this.state.selectedTypes) {
    return types.length
      ? proposals.filter((p) => types.includes(p.type))
      : proposals;
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
      council,
      councils,
      members,
      posts,
      status,
    } = this.props;

    const { page, perPage, author, selectedTypes } = this.state;

    // proposal types
    let types: { [key: string]: number } = {};
    this.props.proposals.forEach((p) => types[p.type]++);

    // authors
    let authors: { [key]: number } = {};
    this.props.proposals.forEach(
      (p) => (authors[p.authorId] = p.author.handle)
    );

    const proposals = this.sortProposals(
      this.filterProposals(this.props.proposals)
    );
    const approved = proposals.filter((p) => p.result === "Approved").length;

    // calculate finalization times
    const durations: any = proposals.map((p) =>
      p.finalizedAt
        ? p.finalizedAt - p.createdAt
        : (block && block - p.createdAt) || 0
    );

    // calculate mean voting duration
    let avgBlocks = 0;
    if (durations.length)
      avgBlocks =
        durations.reduce((a: number, b: number) => a + b) / durations.length;
    const avgDays = Math.floor(avgBlocks / 14400);
    const avgHours = Math.floor((avgBlocks - avgDays * 14400) / 600);

    return (
      <div className="h-100 overflow-hidden">
        <NavBar
          show={!hideNav}
          author={author}
          authors={authors}
          perPage={perPage}
          setPerPage={this.setPerPage}
          selectAuthor={this.selectAuthor}
          toggleShowTypes={this.toggleShowTypes}
        />

        <Types
          selected={selectedTypes}
          show={this.state.showTypes}
          toggleShow={this.toggleShowType}
          types={types}
        />

        <Head
          setKey={this.setKey}
          approved={approved}
          proposals={proposals.length}
          avgDays={avgDays}
          avgHours={avgHours}
        />
        <NavButtons
          show={!hideNav}
          setPage={this.setPage}
          page={page}
          limit={perPage + 1}
          proposals={proposals.length}
        />

        <div className="d-flex flex-column overflow-auto p-2">
          {!proposals.length ? (
            <Spinner />
          ) : (
            proposals
              .slice((page - 1) * perPage, page * perPage)
              .map((p) => (
                <Row
                  key={p.id}
                  {...p}
                  block={block}
                  council={council}
                  members={members}
                  startTime={status.startTime}
                  councils={councils}
                  posts={posts}
                  proposals={this.props.proposals}
                  validators={this.props.validators}
                />
              ))
          )}
        </div>
        <NavButtons
          show={!hideNav}
          setPage={this.setPage}
          page={page}
          limit={perPage + 1}
          proposals={proposals.length}
        />
      </div>
    );
  }
}

export default ProposalTable;
