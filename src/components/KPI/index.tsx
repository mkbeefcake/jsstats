import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  //  AccordionDetails,
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
import axios from "axios";

interface LeaderboardMember {
  id: number;
  handle: string;
  totalEarnedUsd: number;
  totalEarnedTjoy: number;
  timesElected: number;
  usdPerElection: number;
  tjoyPerElection: number;
}
interface CouncilMember {
  id: number;
  handle: string;
  rewardUsd: 51;
  rewardTjoy: number;
}
interface Kpi {
  kpi: number;
  totalPossibleRewardsUsd: 3525;
  councilMembers: CouncilMember[];
}

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

const KPI = (props: { tokenomics: Tokenomics }) => {
  const { tokenomics } = props;
  const price = tokenomics ? tokenomics.price : 30 / 1000000;
  const classes = useStyles();
  const [kpi, setKpi] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    const baseUrl = `https://joystreamstats.live/static/kpi`;
    axios
      .get(`${baseUrl}/data.json`)
      .then((res) => setKpi(res.data))
      .catch((e) => console.error(`Failed to fetch KPI data.`, e));
    axios
      .get(`${baseUrl}/leaderboard.json`)
      .then((res) => setLeaderboard(res.data))
      .catch((e) => console.error(`Failed to fetch Leadboard data.`, e));
  });
  if (!kpi.length) return <Loading target="KPI" />;

  return (
    <Grid className={classes.root} item lg={12}>
      <Typography variant="h2" className="mb-3">
        KPI Grading
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

export default KPI;
