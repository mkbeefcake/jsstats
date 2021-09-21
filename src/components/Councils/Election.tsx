import {
  Grid,
  Typography,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useEffect, useState } from "react";
import { ElectionStatus } from "..";
import { IState, IApplicant, IElectionState, IVote } from "../../types";
import { calculateOtherVotes, getElectionStatus } from "./election-status";
import axios from "axios";
import pako from "pako";
import { electionStyles } from "./styles";
import { ICouncilRounds } from "./types";
import CouncilRounds from "./CouncilRounds";
import { tasksEndpoint } from "../../config";
import CouncilApplicant from "./CouncilApplicant";
import BackerVote from "./BackerVote";

const Election = (props: IState) => {
  const { status, domain } = props;
  const classes = electionStyles();
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [rounds, setRounds] = useState({
    rounds: [],
  } as ICouncilRounds);
  const [electionState, setElectionState] = useState({
    applicants: [],
    votes: [],
    stage: {},
    councilRound: 0,
    councilSize: 16,
  } as IElectionState);

  useEffect(() => {
    setIsLoading(true);
    const councilJson = `${tasksEndpoint}/public/council.json.gz`;
    axios
      .get(councilJson, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        try {
          const binData = new Uint8Array(response.data);
          const roundsJson = JSON.parse(
            new TextDecoder().decode(pako.inflate(binData))
          );
          setRounds(roundsJson as ICouncilRounds);
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          console.log(err);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let votes = [] as IVote[];
    const sortByStake = (a: IApplicant, b: IApplicant) => {
      const votesA = calculateOtherVotes(votes, a);
      const votesB = calculateOtherVotes(votes, b);
      const totalStakeA =
        Number(a.electionStake.new) +
        Number(a.electionStake.transferred) +
        votesA;
      const totalStakeB =
        Number(b.electionStake.new) +
        Number(b.electionStake.transferred) +
        votesB;
      return totalStakeA < totalStakeB ? 1 : -1;
    };

    getElectionStatus().then(
      (state: IElectionState) => {
        votes = state.votes;
        setElectionState({
          ...state,
          votes: sortVotes(votes),
          applicants: state.applicants.sort(sortByStake),
        });
        setIsLoading(false);
        setError(undefined);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );
  }, []);

  const currentStage = () => {
    if (electionState.stage) {
      const keys = Object.keys(electionState.stage);
      if (keys.length > 0) {
        return (
          <div className={classes.chips}>
            <Chip label={`ROUND ${electionState.councilRound}`} color="primary" />
            <Chip label={keys[0].toUpperCase()} color="secondary" />
          </div>
        );
      }
    } 
    return "";
  };

  const sortVotes = (votes: IVote[]) => {
    return votes.sort((v1, v2) => {
      if (
        `${v1.candidateHandle}` !== "undefined" &&
        `${v2.candidateHandle}` === "undefined"
      ) {
        return -1;
      } else if (
        `${v2.candidateHandle}` !== "undefined" &&
        `${v1.candidateHandle}` === "undefined"
      ) {
        return 1;
      }
      const v1Stake = Number(v1.newStake) + Number(v1.transferredStake);
      const v2Stake = Number(v2.newStake) + Number(v2.transferredStake);
      if (v1Stake === v2Stake) return 0;
      return v1Stake > v2Stake ? -1 : 1;
    });
  };

  return (
    <Grid className={classes.root} item lg={12}>
      <Typography variant="h4" className="mb-3">
        {`Council Election`}
        {currentStage()}
        {isLoading && <CircularProgress color="inherit" />}
      </Typography>
      {error !== undefined && (
        <Alert
          style={{ marginTop: 12 }}
          onClose={() => setError(undefined)}
          severity="error"
        >
          {`Error loading election status: [${error}]`}
        </Alert>
      )}
      {!isLoading && (
        <Grid className={classes.grid} item lg={12}>
          <Accordion className={classes.acc}>
            <AccordionSummary
              className={classes.accSummary}
              expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
              aria-controls={`election-content`}
              id={`election-header`}
            >
              <Typography variant="h6" className={classes.title}>
                <ElectionStatus
                  domain={domain}
                  block={status.block?.id}
                  election={status.election}
                />
                {`Ongoing Election (${
                  electionState.applicants.length
                } applicants${
                  electionState.votes.length > 0
                    ? `, ${electionState.votes.length} votes`
                    : ""
                }, max ${electionState.councilSize} seats)`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} className={classes.applicants}>
                <Grid item lg={12} className={classes.applicants}>
                  <Grid container spacing={1} className={classes.applicants}>
                    {electionState.applicants.map(
                      (applicant: IApplicant, index: number) => {
                        return (
                          <CouncilApplicant
                            applicant={applicant}
                            electionState={electionState}
                            index={index}
                            key={index}
                          />
                        );
                      }
                    )}
                  </Grid>
                </Grid>
                {electionState.votes.length > 0 && <Grid item lg={12} className={classes.applicants}>
                  <Typography variant="h5">{`Votes`}</Typography>
                </Grid>}
                <Grid item lg={12} className={classes.applicants}>
                  <Grid container spacing={1} className={classes.applicants}>
                    {electionState.votes.map((vote: IVote, index: number) => {
                      return (
                        <BackerVote key={index} index={index} vote={vote} />
                      );
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      )}
      <Divider />
      <CouncilRounds rounds={rounds} />
    </Grid>
  );
};

export default Election;
