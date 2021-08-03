import React from "react";
import ElectionStatus from "./ElectionStatus";
import MemberBox from "../Members/MemberBox";
import Loading from "../Loading";
import {Paper, Grid, makeStyles, Theme, createStyles, Toolbar, Typography, AppBar} from "@material-ui/core";

import {
  Handles,
  Member,
  Post,
  ProposalDetail,
  Seat,
  Status,
} from "../../types";

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

const Council = (props: {
  councils: Seat[][];
  councilElection?: any;
  members: Member[];
  proposals: ProposalDetail[];
  posts: Post[];
  validators: string[];
  handles: Handles;
  status: Status;
  electionPeriods: number[];
}) => {
  const { councils, handles, members, posts, proposals, status } = props;
  const council = councils[councils.length - 1];
  const classes = useStyles();
  if (!council) return <Loading target="council" />;

  const sortCouncil = (council) =>
    council.sort((a, b) => {
      const handle1 = handles[a.member] || a.member;
      const handle2 = handles[b.member] || b.member;
      return handle1.localeCompare(handle2);
    });

  return (
    <Grid
      style={{ textAlign: "center", backgroundColor: "#000", color: "#fff" }}
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
              Council
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="d-flex flex-wrap justify-content-between mt-2">
          {sortCouncil(council).map((m) => (
            <div key={m.member} className="col-12 col-md-4">
              <MemberBox
                id={m.id || 0}
                account={m.member}
                handle={handles[m.member]}
                members={members}
                councils={councils}
                proposals={proposals}
                placement={"bottom"}
                posts={posts}
                startTime={status.startTime}
                validators={props.validators}
              />
            </div>
          ))}
        </div>
        <hr />
        <ElectionStatus domain={props.domain} status={status} />
      </Paper>
    </Grid>
  );
};

export default Council;
