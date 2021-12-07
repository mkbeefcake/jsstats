import {
  Grid,
  Typography,
  Chip,
  Badge,
  Divider,
  Tooltip,
} from "@material-ui/core";
import { useState } from "react";
import { formatJoy } from "../../lib/util";
import { electionStyles, tooltipStyles } from "./styles";
import { BakerData, SeatData } from "./types";

const CouncilSeat = (props: { seat: SeatData }) => {
  const [seat] = useState(props.seat);
  const classes = electionStyles();
  const tooltipClasses = tooltipStyles();

  return (
    <Grid item key={seat.member.id} lg={2} md={4} sm={6} xs={12}>
      <div className={classes.applicant}>
        <Badge
          className={classes.badge}
          badgeContent={seat.member.id}
          color="primary"
          max={999999}
        >
          <Typography variant="h6">{`${seat.member.handle}`}</Typography>
        </Badge>
        <Divider />
        <Chip
          label={`Total Stake: ${formatJoy(seat.totalStake)}`}
          color="primary"
          className={classes.stakeChip}
        />
        <Chip
          label={`Own Stake: ${formatJoy(seat.ownStake)}`}
          color="primary"
          className={classes.stakeChip}
        />
        <Chip
          label={`Backers Stake: ${formatJoy(seat.backersStake)}`}
          color="primary"
          className={classes.stakeChip}
        />
        <Chip
          label={`JSGenesis Stake: ${formatJoy(seat.jsgStake)}`}
          color="primary"
          className={classes.stakeChip}
        />
        {seat.backers.length === 0 ? (
          <Typography variant="h6">{`No backers`}</Typography>
        ) : (
          <Tooltip
            className={classes.backersTooltip}
            classes={tooltipClasses}
            placement="bottom"
            id={`overlay-${seat.member.handle}`}
            title={
              <Grid container spacing={1}>
                {seat.backers.map((backer: BakerData, index: number) => {
                  return (
                    <Grid className={classes.backerInfo} item key={index} lg={12}>
                      <Badge
                        className={classes.badge}
                        badgeContent={backer.member.id}
                        color="primary"
                        max={999999}
                      >
                        <Typography variant="h6">{`${backer.member.handle}`}</Typography>
                      </Badge>
                      <Divider className={classes.dividerPrimary}/>
                      <Chip
                        label={`Stake: ${formatJoy(backer.stake)}`}
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
            <Typography variant="h6">{`Backers (${seat.backers.length})`}</Typography>
          </Tooltip>
        )}
      </div>
    </Grid>
  );
};

export default CouncilSeat;
