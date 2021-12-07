import { Grid, Typography, Chip, Divider } from "@material-ui/core";
import { IVote } from "../../types";
import { formatJoy } from "./../../lib/util";
import { electionStyles } from "./styles";

const BackerVote = (props: { index: number; vote: IVote }) => {
  const classes = electionStyles();

  return (
    <Grid item key={props.index} lg={2} md={4} sm={6} xs={12}>
      <div className={classes.applicant} key={props.index}>
        <Typography variant="h6">{`${props.index + 1}. ${
          props.vote.voterHandle
        }`}</Typography>
        <Chip
          className={classes.stakeChip}
          label={`Stake: ${formatJoy(
            Number(props.vote.newStake) + Number(props.vote.transferredStake)
          )}`}
          color={"primary"}
        />
        <Divider />
        {props.vote.candidateHandle ? (
          <Chip
            className={classes.stakeChip}
            label={`Candidate: ${props.vote.candidateHandle}`}
            color={"primary"}
          />
        ) : (
          <Chip
            className={classes.stakeChip}
            label={`Not revealed`}
            color={"default"}
          />
        )}
      </div>
    </Grid>
  );
};

export default BackerVote;
