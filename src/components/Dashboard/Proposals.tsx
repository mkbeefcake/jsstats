import React from "react";
import ProposalsTable from "../Proposals/ProposalTable";
import Loading from "../Loading";
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
  proposals;
  validators;
  councils;
  members;
  posts;
  startTime: number;
  block: number;
}) => {
  const { proposals, validators, councils, members, posts, startTime, block } =
    props;
  const classes = useStyles();
  const pending = proposals.filter((p) => p && p.result === "Pending");
  if (!proposals.length) return <Loading target="proposals" />;
  if (!pending.length) {
    const loading = proposals.filter((p) => !p);
    return loading.length ? (
      <Loading />
    ) : (
      <div className="box">No active proposals.</div>
    );
  }

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
        <ProposalsTable
          block={block}
          hideNav={true}
          proposals={pending}
          proposalPosts={props.proposalPosts}
          members={members}
          councils={councils}
          posts={posts}
          startTime={startTime}
          validators={validators}
        />
      </Paper>
    </Grid>
  );
};

export default Proposals;
