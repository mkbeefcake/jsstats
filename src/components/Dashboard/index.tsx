import React from "react";
import Council from "../Council";
import Forum from "./Forum";
import Proposals from "./Proposals";
import Validators from "../Validators";
import { IState } from "../../types";
import { Container, Grid } from "@material-ui/core";

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const Dashboard = (props: IProps) => {
  const {
    toggleStar,
    councils,
    handles,
    members,
    nominators,
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
          <Council
            councils={councils}
            members={members}
            handles={handles}
            posts={posts}
            proposals={proposals}
            stars={stars}
            status={status}
            validators={validators}
            domain={domain}
          />
          <Proposals
            block={status.block ? status.block.id : 0}
            members={members}
            councils={councils}
            posts={posts}
            proposals={proposals}
            proposalPosts={props.proposalPosts}
            validators={validators}
            startTime={status.startTime}
          />
          <Forum
            handles={handles}
            posts={posts}
            threads={threads}
            startTime={status.startTime}
          />
          <Grid
            style={{
              textAlign: "center",
              backgroundColor: "#000",
              color: "#fff",
            }}
            item
            lg={6}
          >
            <Validators
              hideBackButton={true}
              toggleStar={toggleStar}
              councils={councils}
              handles={handles}
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
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
