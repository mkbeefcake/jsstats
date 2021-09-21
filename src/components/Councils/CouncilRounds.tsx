import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { electionStyles } from "./styles";
import CouncilSeat from "./CouncilSeat";
import { CouncilRound, ICouncilRounds, SeatData } from "./types";

const CouncilRounds = (props: { rounds: ICouncilRounds }) => {
  const classes = electionStyles();

  const sortByStake = (seatA: SeatData, seatB: SeatData) => {
    return seatA.totalStake < seatB.totalStake ? 1 : -1;
  };

  return (
    <Grid className={classes.root} item lg={12}>
      {props.rounds.rounds
        .filter((r) => r.seats.length > 0)
        .map((r: CouncilRound, index: number) => {
          return (
            <Accordion className={classes.acc} key={index}>
              <AccordionSummary
                className={classes.accSummary}
                expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
                aria-controls={`${index}-content`}
                id={`${index}-header`}
              >
                <Typography variant="h6">{`Round ${r.round} (end block: ${r.termEndsAt})`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid item key={index} lg={12}>
                  <Grid container spacing={1}>
                    {r.seats.sort(sortByStake).map((seat: SeatData, index: number) => (
                      <CouncilSeat seat={seat} key={index} />
                    ))}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Grid>
  );
};

export default CouncilRounds;
