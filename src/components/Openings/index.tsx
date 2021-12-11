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
      minHeight: 600,
      maxHeight: 600,
      overflow: "auto",
    },
  })
);

const activeOpenings = (openings: Opening[]): Opening[] => {
  if (!openings?.length) return [];
  return openings.filter(
    (o) => Object.keys(o.stage["active"].stage)[0] === "acceptingApplications"
  );
};

const Openings = (props: { openings: {} }) => {
  const classes = useStyles();
  const { members, openings } = props;
  if (!openings) return <div />;
  const groups = Object.keys(openings).filter((g) => g !== "timestamp");
  const active = groups
    .map((group) => activeOpenings(openings[group]))
    .reduce((sum: number, a: Opening[]) => sum + a.length, 0);

  //if (!active.length) return <div />;
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
        <div className="m-3 text-center">
          {active || `No`} active openings in {groups.length} group
          {groups.length !== 1 ? `s` : ``}.
        </div>
        <div>
          {groups.map((group) => (
            <GroupOpenings
              key={`${group}-openings`}
              members={members}
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
