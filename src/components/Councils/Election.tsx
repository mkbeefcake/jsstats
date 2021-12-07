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
import { calculateOtherVotes } from "../../lib/util";
import axios from "axios";
import pako from "pako";
import { electionStyles } from "./styles";
import { ICouncilRounds } from "./types";
import CouncilRounds from "./CouncilRounds";
import { tasksEndpoint } from "../../config";
import CouncilApplicant from "./CouncilApplicant";
import BackerVote from "./BackerVote";

const sortVotes = (votes: IVote[]) => {
  return votes.sort((v1, v2) => {
    if (`${v1.candidateHandle}` && !`${v2.candidateHandle}`) return -1;
    else if (`${v2.candidateHandle}` && !`${v1.candidateHandle}`) return 1;
    const v1Stake = Number(v1.newStake) + Number(v1.transferredStake);
    const v2Stake = Number(v2.newStake) + Number(v2.transferredStake);
    if (v1Stake === v2Stake) return 0;
    return v1Stake > v2Stake ? -1 : 1;
  });
};

const Applicants = (props: {
  election: IElectionState;
  applicants: IApplicant[];
}) => {
  const { applicants, election } = props;
  return applicants.map((applicant, index: number) => (
    <CouncilApplicant
      applicant={applicant}
      election={election}
      index={index}
      key={index}
    />
  ));
};

const ElectionVotes = (props: { votes: IVote[] }) => {
  const { votes } = props;
  return sortVotes(votes).map((vote, index: number) => {
    return <BackerVote key={index} index={index} vote={vote} />;
  });
};

const Election = (props: IState) => {
  const classes = electionStyles();
  const { block, round, stage, termEndsAt, domain, election } = props;
  const { applicants, votes, councilSize } = election;
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [rounds, setRounds] = useState({
    rounds: [],
  } as ICouncilRounds);

  useEffect(() => {
    const councilJson = `${tasksEndpoint}/public/council.json.gz`;
    axios
      .get(councilJson, { responseType: "arraybuffer" })
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

  const sortByStake = (a: IApplicant, b: IApplicant) => {
    const votesA = calculateOtherVotes(votes, a);
    const votesB = calculateOtherVotes(votes, b);
    const stakeA = +a.electionStake.new + +a.electionStake.transferred + votesA;
    const stakeB = +b.electionStake.new + +b.electionStake.transferred + votesB;
    return stakeA < stakeB ? 1 : -1;
  };

  const currentStage = () => {
    if (!stage) return "";
    const keys = Object.keys(stage);
    if (!keys.length) return "";
    return (
      <div className={classes.chips}>
        <Chip label={`ROUND ${round}`} color="primary" />
        <Chip label={keys[0].toUpperCase()} color="secondary" />
      </div>
    );
  };

  return (
    <Grid className={classes.root} item lg={12}>
      <Typography variant="h4" className="mb-3">
        {`Council Election`}
        {currentStage()}
        {isLoading && <CircularProgress color="inherit" />}
      </Typography>
      {error && (
        <Alert
          style={{ marginTop: 12 }}
          onClose={() => setError(undefined)}
          severity="error"
        >
          {`Error loading election status: ${JSON.stringify(error)}`}
        </Alert>
      )}

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
                block={block}
                stage={stage}
                termEndsAt={termEndsAt}
              />
              {`Ongoing Election (${applicants.length} applicants${
                votes.length > 0 ? `, ${votes.length} votes` : ""
              }, max ${councilSize} seats)`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} className={classes.applicants}>
              <Grid item lg={12} className={classes.applicants}>
                <Grid container spacing={1} className={classes.applicants}>
                  <Applicants
                    applicants={applicants.sort(sortByStake)}
                    election={election}
                  />
                </Grid>
              </Grid>
              {votes.length && (
                <Grid item lg={12} className={classes.applicants}>
                  <Typography variant="h5">{`Votes`}</Typography>
                </Grid>
              )}
              <Grid item lg={12} className={classes.applicants}>
                <Grid container spacing={1} className={classes.applicants}>
                  <ElectionVotes votes={votes} />
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Divider />
      <CouncilRounds rounds={rounds} />
    </Grid>
  );
};

export default Election;
