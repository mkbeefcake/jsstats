import React from "react";
import Council from "./Council";
import Forum from "./Forum";
import Proposals from "./Proposals";
import Validators from "../Validators";
import Openings from "../Openings";
import { IState } from "../../types";
import { Container, Grid } from "@material-ui/core";

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const Dashboard = (props: IProps) => {
  const {
    getMember,
    toggleStar,
    councils,
    members,
    nominators,
    openings,
    posts,
    proposals,
    rewardPoints,
    threads,
    tokenomics,
    status,
    stars,
    stashes,
    stakes,
    validators,
    domain,
  } = props;

  return (
    <div style={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Proposals
            fetchProposals={props.fetchProposals}
            block={status.block ? status.block.id : 0}
            members={members}
            councils={councils}
            posts={posts}
            proposals={proposals}
            proposalPosts={props.proposalPosts}
            validators={validators}
            status={status}
            gridSize={6}
          />
          <Council
            getMember={getMember}
            councils={councils}
            council={status.council}
            posts={posts}
            proposals={proposals}
            stars={stars}
            status={status}
            validators={validators}
            domain={domain}
            gridSize={6}
          />
          <Forum
            updateForum={props.updateForum}
            posts={posts}
            threads={threads}
            startTime={status.startTime}
          />
          <Openings openings={openings} />
          <Validators
            toggleStar={toggleStar}
            councils={councils}
            members={members}
            posts={posts}
            proposals={proposals}
            nominators={nominators}
            validators={validators}
            stashes={stashes}
            stars={stars}
            stakes={stakes}
            rewardPoints={rewardPoints}
            tokenomics={tokenomics}
            status={status}
          />
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
