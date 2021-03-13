import React from "react";
import { Link } from "react-router-dom";
import { Council } from "..";
import Proposals from "../Proposals/ProposalTable";
import Post from "../Forum/LatestPost";
import Footer from "./Footer";
import Validators from "../Validators";
import { IState } from "../../types";

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const Dashboard = (props: IProps) => {
  const {
    connecting,
    block,
    now,
    domain,
    handles,
    members,
    posts,
    proposals,
    threads,
    tokenomics,
  } = props;
  const userLink = `${domain}/#/members/joystreamstats`;
  return (
    <div className="w-100 flex-grow-1 d-flex align-items-center justify-content-center d-flex flex-column">
      <div
        className="box position-fixed bg-warning d-flex flex-column"
        style={{ top: "0px", right: "0px" }}
      >
        <Link to={`/calendar`}>Calendar</Link>
        <Link to={`/timeline`}>Timeline</Link>
        <Link to={`/tokenomics`}>Reports</Link>
        <Link to={`/validators`}>Validators</Link>
        <Link to="/mint">Toolbox</Link>
      </div>

      <h1 className="title">
        <a href={domain}>Joystream</a>
      </h1>

      <Council
        councils={props.councils}
        members={members}
        councilElection={props.councilElection}
        block={block}
        now={now}
        round={props.round}
        handles={props.handles}
        termEndsAt={props.termEndsAt}
        stage={props.stage}
        posts={props.posts}
        proposals={props.proposals}
        validators={props.validators}
      />

      <div className="w-100 p-3 m-3">
        <div className="d-flex flex-row">
          <h3 className="ml-1 text-light">Active Proposals</h3>
          <Link className="m-3 text-light" to={"/proposals"}>
            All
          </Link>
          <Link className="m-3 text-light" to={"/councils"}>
            Votes
          </Link>
        </div>
        <Proposals
          hideNav={true}
          startTime={now - block * 6000}
          block={block}
          proposals={proposals.filter((p) => p && p.result === "Pending")}
          proposalPosts={props.proposalPosts}
          members={members}
          councils={props.councils}
          posts={posts}
          validators={props.validators}
        />
      </div>

      <div className="w-100 p-3 m-3 d-flex flex-column">
        <h3>
          <Link className="text-light" to={"/forum"}>
            Forum
          </Link>
        </h3>
        {posts
          .sort((a, b) => b.id - a.id)
          .slice(0, 10)
          .map((post) => (
            <Post
              key={post.id}
              selectThread={() => {}}
              handles={handles}
              post={post}
              thread={threads.find((t) => t.id === post.threadId)}
              startTime={now - block * 6000}
            />
          ))}
      </div>

      <div className="w-100 p-3 m-3">
        <Validators
          block={block}
          era={props.era}
          now={now}
          lastReward={props.lastReward}
          councils={props.councils}
          handles={handles}
          members={members}
          posts={props.posts}
          proposals={props.proposals}
          nominators={props.nominators}
          validators={props.validators}
          stashes={props.stashes}
          stars={props.stars}
          stakes={props.stakes}
          toggleStar={props.toggleStar}
          rewardPoints={props.rewardPoints}
          tokenomics={tokenomics}
          hideBackButton={true}
        />
      </div>

      <Footer
        toggleHide={props.toggleFooter}
        show={!props.hideFooter}
        connecting={connecting}
        link={userLink}
      />
      {connecting ? <div className="connecting">Connecting ..</div> : ""}
    </div>
  );
};

export default Dashboard;
