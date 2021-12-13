import React from "react";
import { MemberBox, Spinner } from "..";
import ElectionStatus from "../Councils/ElectionStatus";
import {
  Paper,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  Toolbar,
  Typography,
  AppBar,
  GridSize,
} from "@material-ui/core";

import { Council, Post, ProposalDetail, Status } from "../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: { textAlign: "center", backgroundColor: "#000", color: "#fff" },
    root: { flexGrow: 1, backgroundColor: "#4038FF" },
    title: { textAlign: "left", flexGrow: 1 },
    paper: {
      textAlign: "center",
      backgroundColor: "#4038FF",
      color: "#fff",
      minHeight: 600,
      maxHeight: 600,
      overflow: "auto",
    },
  })
);

const CouncilGrid = (props: {
  councilElection?: any;
  councils: Council[];
  proposals: ProposalDetail[];
  posts: Post[];
  validators: string[];
  status: Status;
  electionPeriods: number[];
  gridSize: GridSize;
}) => {
  const { getMember, councils, domain, posts, proposals, status, gridSize } =
    props;
  const { council, election } = status;
  const classes = useStyles();

  const sortCouncil = (consuls) =>
    consuls.sort((a, b) =>
      (a.member?.handle || "").localeCompare(b.member?.handle || "")
    );

  return (
    <Grid className={classes.grid} item lg={gridSize} xs={12}>
      <Paper className={classes.paper}>
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <ElectionStatus
                domain={domain}
                block={status?.block?.id}
                stage={election?.stage}
                termEndsAt={election?.termEndsAt}
              />
              Council
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="d-flex flex-wrap justify-content-between mt-2">
          {council?.consuls?.length ? (
            sortCouncil(council.consuls).map((c) => (
              <div key={c.memberId} className="col-12 col-md-4">
                <MemberBox
                  id={c.memberId}
                  member={getMember(c.member.handle)}
                  councils={councils}
                  council={council}
                  proposals={proposals}
                  placement={"bottom"}
                  posts={posts}
                  startTime={status.startTime}
                  validators={props.validators}
                />
              </div>
            ))
          ) : (
            <Spinner />
          )}
        </div>
      </Paper>
    </Grid>
  );
};

export default CouncilGrid;
