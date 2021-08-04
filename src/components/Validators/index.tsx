import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Stats from "./MinMax";
import Validator from "./Validator";
import Waiting from "./Waiting";
import Loading from "../Loading";

import {
  Handles,
  Member,
  Post,
  ProposalDetail,
  Seat,
  Stakes,
  RewardPoints,
  Status,
  Tokenomics,
} from "../../types";
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

interface IProps {
  councils: Seat[][];
  handles: Handles;
  members: Member[];
  posts: Post[];
  proposals: ProposalDetail[];
  validators: string[];
  stashes: string[];
  nominators: string[];
  stars: { [key: string]: boolean };
  toggleStar: (account: string) => void;
  stakes?: { [key: string]: Stakes };
  rewardPoints?: RewardPoints;
  tokenomics?: Tokenomics;
  status: Status;
}

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

const Validators = (iProps: IProps) => {
  const [props] = useState(iProps);
  const [sortBy, setSortBy] = useState("totalStake");

  const [showWaiting, setShowWaiting] = useState(false);
  const [showValidators, setShowValidators] = useState(false);

  const toggleValidators = () => setShowValidators((prev) => !prev);

  const toggleWaiting = () => setShowWaiting((prev) => !prev);

  const sortValidators = (field: string, validators: string[]) => {
    const { stakes, rewardPoints } = props;
    try {
      if (field === "points" || !stakes)
        return validators.sort((a, b) =>
          rewardPoints
            ? rewardPoints.individual[b] - rewardPoints.individual[a]
            : 0
        );

      if (field === "commission")
        return validators.sort((a, b) =>
          stakes[a] && stakes[b]
            ? stakes[a].commission - stakes[b].commission
            : 0
        );

      if (field === "ownStake")
        return validators.sort((a, b) =>
          stakes[a] && stakes[b] ? stakes[b].own - stakes[a].own : 0
        );

      if (field === "totalStake")
        return validators.sort((a, b) =>
          stakes[a] && stakes[b] ? stakes[b].total - stakes[a].total : 0
        );

      if (field === "othersStake") {
        const sumOf = (stakes: { value: number }[]) => {
          let sum = 0;
          stakes.forEach((s) => (sum += s.value));
          return sum;
        };

        return validators.sort((a, b) =>
          stakes[a] && stakes[b]
            ? sumOf(stakes[b].others) - sumOf(stakes[a].others)
            : 0
        );
      }
    } catch (e) {
      console.debug(`sorting failed`, e);
    }

    return validators;
  };

  const {
    councils,
    handles,
    members,
    posts,
    proposals,
    validators,
    nominators,
    stashes,
    stars,
    rewardPoints,
    status,
    stakes,
    tokenomics,
  } = props;

  const classes = useStyles();

  if (!status || !status.block) return <Loading gridSize={12} />;

  const { lastReward, block, era, startTime } = status;

  const issued = tokenomics ? Number(tokenomics.totalIssuance) : 0;
  const price = tokenomics ? Number(tokenomics.price) : 0;

  const starred = stashes.filter((v) => stars[v]);
  const unstarred = validators.filter((v) => !stars[v]);
  const waiting = stashes.filter((s) => !stars[s] && !validators.includes(s));

  if (!unstarred.length) return <Loading gridSize={12} target="validators" />;

  return (
    <Grid
      style={{
        textAlign: "center",
        backgroundColor: "#000",
        color: "#fff",
      }}
      item
      lg={12}
    >
      <Paper
        style={{
          textAlign: "center",
          backgroundColor: "#4038FF",
          color: "#fff",
          height: 600,
          overflow: "auto",
        }}
      >
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography
              className={classes.title}
              variant="h6"
              onClick={() => toggleValidators()}
            >
              Validator Stats
            </Typography>
          </Toolbar>
        </AppBar>

        <Stats
          block={block}
          era={era}
          stakes={stakes}
          issued={issued}
          price={price}
          validators={validators}
          nominators={nominators.length}
          waiting={waiting.length}
          reward={status.lastReward}
        />

        <div className="d-flex flex-column">
          {sortValidators(sortBy, starred).map((v) => (
            <Validator
              key={v}
              sortBy={setSortBy}
              starred={stars[v] ? `teal` : undefined}
              toggleStar={props.toggleStar}
              startTime={startTime}
              validator={v}
              reward={lastReward / validators.length}
              councils={councils}
              handles={handles}
              members={members}
              posts={posts}
              proposals={proposals}
              validators={validators}
              stakes={stakes}
              rewardPoints={rewardPoints}
            />
          ))}

          <Button onClick={() => toggleValidators()}>
            Toggle {unstarred.length} validators
          </Button>

          {showValidators &&
            sortValidators(sortBy, unstarred).map((v) => (
              <Validator
                key={v}
                sortBy={sortBy}
                starred={stars[v] ? `teal` : undefined}
                toggleStar={props.toggleStar}
                startTime={startTime}
                validator={v}
                reward={lastReward / validators.length}
                councils={councils}
                handles={handles}
                members={members}
                posts={posts}
                proposals={proposals}
                validators={validators}
                stakes={stakes}
                rewardPoints={rewardPoints}
              />
            ))}

          <Waiting
            toggleWaiting={toggleWaiting}
            show={showWaiting}
            waiting={waiting}
            posts={posts}
            proposals={proposals}
            members={members}
            handles={handles}
          />
        </div>
      </Paper>
    </Grid>
  );
};

export default Validators;
