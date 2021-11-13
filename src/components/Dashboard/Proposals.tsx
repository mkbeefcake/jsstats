import { Link } from "react-router-dom";
import { RefreshCw } from "react-feather";
import { ProposalTable } from "..";
import {
  createStyles,
  makeStyles,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Theme,
} from "@material-ui/core";
import { Council, Member, ProposalDetail, Post } from "../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: { textAlign: "center", backgroundColor: "#000", color: "#fff" },
    root: { flexGrow: 1, backgroundColor: "#4038FF" },
    title: { textAlign: "left", flexGrow: 1 },
    paper: {
      textAlign: "center",
      backgroundColor: "#4038FF",
      color: "#fff",
      minHeight: 500,
      maxHeight: 500,
      overflow: "auto",
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
  const classes = useStyles();
  const { proposals, validators, councils, members, posts, block, status } =
    props;
  const pending = proposals.filter((p) => p && p.result === "Pending");

  return (
    <Grid className={classes.grid} item lg={6}>
      <Paper className={classes.paper}>
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
