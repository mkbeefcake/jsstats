import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Tokenomics } from "../../types";
import { Loading } from "..";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
    },
    acc: {
      color: "#fff",
      backgroundColor: "#4138ff",
    },
    heading: {
      fontSize: theme.typography.pxToRem(25),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
);

const Leaderboard = (props: {
  leaderboard: LeaderboardMember[];
  tokenomics: Tokenomics;
}) => {
  const { kpi, tokenomics, leaderboard } = props;
  const price = tokenomics ? tokenomics.price : 30 / 1000000;
  const classes = useStyles();
  if (!leaderboard.length) return <Loading target="data" />;

  return (
    <Grid className={classes.root} item lg={12}>
      <Typography variant="h2" className="mb-3">
        Top 20
      </Typography>

      {leaderboard ? (
        <div>
          <div className="d-flex flex-row text-right font-weight-bold">
            <div className="col-2">Member</div>
            <div className="col-1">Times Elected</div>
            <div className="col-2">Total Earned USD</div>
            <div className="col-2">Total Earned M tJOY</div>
            <div className="col-2">USD per Election</div>
            <div className="col-2">M tJOY per Election</div>
          </div>

          {leaderboard
            .sort((a, b) => b.totalEarnedUsd - a.totalEarnedUsd)
            .slice(0, 20)
            .map((m: LeaderboardMember) => (
              <div className="d-flex flex-row text-right mt-1">
                <div className="col-2">
                  <Link className="text-light" to={`/members/${m.handle}`}>
                    {m.handle}
                  </Link>
                </div>
                <div className="col-1">{m.timesElected}</div>
                <div className="col-2">$ {m.totalEarnedUsd}</div>
                <div className="col-2">
                  {(m.totalEarnedUsd / price / 1000000).toFixed(1)}
                </div>
                <div className="col-2">{m.usdPerElection}</div>
                <div className="col-2">
                  {(m.usdPerElection / price / 1000000).toFixed(1)}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div />
      )}

      <Typography variant="h3" className="my-3">
        Grading
      </Typography>

      {kpi.map((round: Kpi) => (
        <Accordion className={classes.acc} key={round.kpi}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
            aria-controls={`${round.kpi}-content`}
            id={`${round.kpi}-header`}
          >
            <h3>Round {round.kpi}</h3>
            <div className="ml-2">(max: $ {round.totalPossibleRewardsUsd})</div>
          </AccordionSummary>

          <div className="d-flex flex-column">
            <div className="d-flex flex-row text-right font-weight-bold">
              <div className="col-2">Member</div>
              <div className="col-2">Reward USD</div>
              <div className="col-2">Reward M tJOY</div>
            </div>

            {round.councilMembers
              .sort((a, b) => b.rewardUsd - a.rewardUsd)
              .map((m) => (
                <div className="d-flex flex-row text-right">
                  <div className="col-2">
                    <Link to={`/members/${m.handle}`}>{m.handle}</Link>
                  </div>
                  <div className="col-2">$ {m.rewardUsd}</div>
                  <div className="col-2">
                    {(m.rewardUsd / price / 1000000).toFixed(1)}
                  </div>
                </div>
              ))}
          </div>
        </Accordion>
      ))}
    </Grid>
  );
};

export default Leaderboard;
