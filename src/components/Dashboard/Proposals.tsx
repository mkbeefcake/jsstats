import React from "react";
import { ProposalTable } from "..";
import {
  AppBar,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Paper,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Council, Member, ProposalDetail, Post } from "../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "#4038FF",
    },
    title: {
      textAlign: "left",
      flexGrow: 1,
    },
  })
);

const Proposals = (props: {
  proposals: ProposalDetail[];
  validators: string[];
  councils: Council[];
  members: Member[];
  posts: Post[];
  startTime: number;
  block: number;
  status: { council: Council };
}) => {
  const {
    proposals,
    validators,
    councils,
    members,
    posts,
    block,
    status,
  } = props;
  const classes = useStyles();
  const pending = proposals.filter((p) => p && p.result === "Pending");

  if (proposals.length && !pending.length)
    return <div className="box">No active proposals.</div>;

  return (
    <Grid
      style={{
        textAlign: "center",
        backgroundColor: "#000",
        color: "#fff",
      }}
      item
      lg={6}
    >
      <Paper
        style={{
          textAlign: "center",
          backgroundColor: "#4038FF",
          color: "#fff",
          height: 500,
          overflow: "auto",
        }}
      >
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Active Proposals
            </Typography>
            <Link className="m-3 text-light" href={"/proposals"}>
              All
            </Link>
            <Link className="m-3 text-light" href={"/spending"}>
              Spending
            </Link>
            <Link className="m-3 text-light" href={"/councils"}>
              Votes
            </Link>
          </Toolbar>
        </AppBar>
        <ProposalTable
          block={block}
          hideNav={true}
          proposals={pending}
          members={members}
          council={status.council}
          councils={councils}
          posts={posts}
          status={status}
          validators={validators}
        />
      </Paper>
    </Grid>
  );
};

export default Proposals;
