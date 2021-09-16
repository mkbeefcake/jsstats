import {
  Badge,
  Chip,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { IApplicant, IVote } from "../../types";
import { formatJoy } from "./election-status";
import { tooltipStyles } from "./styles";
import { electionStyles } from "./styles";

const ApplicantVotes = (props: { applicant: IApplicant; votes: IVote[] }) => {
  const classes = electionStyles();
  const tooltipClasses = tooltipStyles();
  const applicantVotes = props.votes.filter(
    (v) => `${v.candidateHandle}` === `${props.applicant.member.handle}`
  );

  return (
    <div>
      {applicantVotes.length === 0 ? (
        <Typography variant="h6">{`No votes`}</Typography>
      ) : (
        <Tooltip
          className={classes.backersTooltip}
          classes={tooltipClasses}
          placement="bottom"
          id={`overlay-${props.applicant.member.id}`}
          title={
            <Grid container spacing={1}>
              {applicantVotes.map((vote: IVote, index: number) => {
                return (
                  <Grid className={classes.backerInfo} item key={index} lg={12}>
                    <Badge
                      className={classes.badge}
                      badgeContent={`${
                        (vote.voterId as unknown as Array<Number>)[0]
                      }`}
                      color="primary"
                      max={999999}
                    >
                      <Typography variant="h6">{`${vote.voterHandle}`}</Typography>
                    </Badge>
                    <Divider className={classes.dividerPrimary}/>
                    <Chip
                      label={`Stake: ${formatJoy(
                        Number(vote.newStake) + Number(vote.transferredStake)
                        )}`}
                      color="primary"
                      className={classes.stakeChip}
                    />
                    <Divider />
                  </Grid>
                );
              })}
            </Grid>
          }
        >
          <Typography variant="h6">{`Backers (${applicantVotes.length})`}</Typography>
        </Tooltip>
      )}
    </div>
  );
};

export default ApplicantVotes;
