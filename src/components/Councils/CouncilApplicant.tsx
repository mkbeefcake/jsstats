import { Grid, Typography, Chip } from "@material-ui/core";
import { IApplicant, IElectionState } from "../../types";
import ApplicantVotes from "./ApplicantVotes";
import { electionStyles } from "./styles";
import { calculateOtherVotes, formatJoy } from "./election-status";

const CouncilApplicant = (props: { applicant: IApplicant; electionState: IElectionState, index: number }) => {
  const classes = electionStyles();
  const othersStake = calculateOtherVotes(
    props.electionState.votes,
    props.applicant
  );
  return (
    <Grid item lg={2} md={4} sm={6} xs={12}>
      <div className={classes.applicant}>
        <Typography variant="h6">
          {`${props.index + 1}. ${props.applicant.member.handle}`}
        </Typography>
        <Chip
          className={classes.stakeChip}
          label={`Total Stake: ${formatJoy(
            Number(props.applicant.electionStake.new) +
              Number(props.applicant.electionStake.transferred) +
              othersStake
          )}`}
          color={props.index < props.electionState.councilSize ? "primary" : "default"}
        />
        <Chip
          className={classes.stakeChip}
          label={`Own Stake: ${formatJoy(
            Number(props.applicant.electionStake.new) +
              Number(props.applicant.electionStake.transferred)
          )}`}
          color={props.index < props.electionState.councilSize ? "primary" : "default"}
        />
        <Chip
          className={classes.stakeChip}
          label={`Others Stake: ${formatJoy(othersStake)}`}
          color={props.index < props.electionState.councilSize ? "primary" : "default"}
        />
        <ApplicantVotes votes={props.electionState.votes} applicant={props.applicant} />
      </div>
    </Grid>
  );
};

export default CouncilApplicant;
