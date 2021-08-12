import React from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "react-feather";
import { ProposalTable } from "..";
import {
  AppBar,
  createStyles,
  Grid,
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
          minHeight: 500,
          maxHeight: 500,
          overflow: "auto",
        }}
      >
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Active Proposals: {pending.length}
              <RefreshCw className="ml-2" onClick={props.fetchProposals} />
            </Typography>
            <Link className="m-3 text-light" to={"/proposals"}>
              All
            </Link>
            <Link className="m-3 text-light" to={"/spending"}>
              Spending
            </Link>
            <Link className="m-3 text-light" to={"/councils"}>
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
