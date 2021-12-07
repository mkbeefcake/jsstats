import GroupOpenings from "./Group";
import {
  createStyles,
  makeStyles,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Theme,
} from "@material-ui/core";

import { Opening } from "./types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: { textAlign: "center", backgroundColor: "#000", color: "#fff" },
    root: { flexGrow: 1, backgroundColor: "#4038FF" },
    title: { textAlign: "left", flexGrow: 1 },
    paper: {
      textAlign: "left",
      backgroundColor: "#4038FF",
      color: "#fff",
      minHeight: 500,
      maxHeight: 500,
      overflow: "auto",
    },
  })
);

const activeOpenings = (openings: Opening[]) =>
  openings.filter(
    (o) => Object.keys(o.stage["active"].stage)[0] === "acceptingApplications"
  );

const Openings = (props: { openings: {} }) => {
  const classes = useStyles();
  const { openings } = props;
  if (!openings) return <div />;
  const groups = Object.keys(openings).filter((g) => g !== "_lastUpdate");
  const active = groups.reduce(
    (sum, group) => sum + activeOpenings(openings[group]),
    0
  );
  if (!active.length) return <div />;

  return (
    <Grid className={classes.grid} item lg={6}>
      <Paper className={classes.paper}>
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Openings
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          {groups.map((group) => (
            <GroupOpenings
              key={`${group}-openings`}
              group={group}
              openings={activeOpenings(openings[group])}
            />
          ))}
        </div>
      </Paper>
    </Grid>
  );
};

export default Openings;
