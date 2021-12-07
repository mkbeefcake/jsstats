import { Grid, Typography, Chip } from "@material-ui/core";
import { IApplicant, IElectionState } from "../../types";
import ApplicantVotes from "./ApplicantVotes";
import { electionStyles } from "./styles";
import { calculateOtherVotes, formatJoy } from "../../lib/util";

const CouncilApplicant = (props: {
  applicant: IApplicant;
  election: IElectionState;
  index: number;
}) => {
  const classes = electionStyles();
  const { index, election, applicant } = props;
  const { electionStake } = applicant;
  const othersStake = calculateOtherVotes(election.votes, applicant);
  return (
    <Grid item lg={2} md={4} sm={6} xs={12}>
      <div className={classes.applicant}>
        <Typography variant="h6">
          {`${index + 1}. ${applicant.member.handle}`}
        </Typography>
        <Chip
          className={classes.stakeChip}
          label={`Total Stake: ${formatJoy(
            +electionStake.new + +electionStake.transferred + othersStake
          )}`}
          color={index < election.councilSize ? "primary" : "default"}
        />
        <Chip
          className={classes.stakeChip}
          label={`Own Stake: ${formatJoy(
            +electionStake.new + +electionStake.transferred
          )}`}
          color={index < election.councilSize ? "primary" : "default"}
        />
        <Chip
          className={classes.stakeChip}
          label={`Others Stake: ${formatJoy(othersStake)}`}
          color={index < election.councilSize ? "primary" : "default"}
        />
        <ApplicantVotes votes={election.votes} applicant={applicant} />
      </div>
    </Grid>
  );
};

export default CouncilApplicant;
