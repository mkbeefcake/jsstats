import React from "react";
import {
  createStyles,
  makeStyles,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Theme,
} from "@material-ui/core";

import Burns from "./Burns";
import Overview from "./Overview";
import DollarPoolChanges from "./DollarPoolChanges";
import ReportBrowser from "./ReportBrowser";
import TokenValue from "./TokenValue";
import Spending from "./Spending";
import Groups from "./Groups";
import Loading from "../Loading";
import { groupsMinting } from "./lib";

import { Tokenomics } from "../../types";

interface IProps {
  reports: { [key: string]: string };
  tokenomics?: Tokenomics;
  history: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { backgroundColor: "#4038FF" },
    title: { textAlign: "center" },
    paper: { backgroundColor: "#4038FF", color: "#fff" },
  })
);

const TokenStats = (props: IProps) => {
  const classes = useStyles();
  const { reports, tokenomics, council, mints, workers, validators } = props;
  if (!tokenomics) return <Loading target="tokenomics" />;
  const { exchanges, extecutedBurnsAmount, totalIssuance } = tokenomics;
  const groups = groupsMinting(council, workers, validators);

  return (
    <Paper className={classes.paper}>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            Tokenomics
          </Typography>
        </Toolbar>
      </AppBar>
      <Overview groups={groups} tokenomics={tokenomics} />

      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            Spending & Stake
          </Typography>
        </Toolbar>
      </AppBar>
      <Spending groups={groups} price={tokenomics.price} />

      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            Working Groups
          </Typography>
        </Toolbar>
      </AppBar>
      <Groups mints={mints} workers={workers} price={tokenomics.price} />

      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            Token Value
          </Typography>
        </Toolbar>
      </AppBar>
      <TokenValue exchanges={exchanges} />

      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Burns & Top Ups
          </Typography>
        </Toolbar>
      </AppBar>
      <Burns
        exchanges={exchanges}
        executed={extecutedBurnsAmount / 1000000}
        percent={extecutedBurnsAmount / (totalIssuance + extecutedBurnsAmount)}
      />
      <DollarPoolChanges dollarPoolChanges={tokenomics.dollarPoolChanges} />
    </Paper>
  );
};

export default TokenStats;
