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
//import { fixGroupName } from "../../lib/util";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: { textAlign: "center", backgroundColor: "#000", color: "#fff" },
    root: { flexGrow: 1, backgroundColor: "#4038FF" },
    title: { textAlign: "left", flexGrow: 1 },
    paper: {
      textAlign: "left",
      backgroundColor: "#4038FF",
      color: "#fff",
    },
  })
);

const Openings = (props: { openings: {} }) => {
  const classes = useStyles();
  const { openings } = props;
  if (!openings) return <div />;

  console.debug(`openings`, openings);
  return (
    <Grid className={classes.grid} item lg={12}>
      <Paper className={classes.paper}>
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Openings
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="m-3 text-center d-flex flex-wrap">
          <div className="col-4">
            <h2>Added</h2>
            {openings?.openingAddedEvents?.map((o, i) => (
              <div key={`opening-added` + i} className="d-flex flex-row">
                <div className="col-3">{o.inBlock}</div>
                <div className="col-8">{o.groupId}</div>
              </div>
            ))}
          </div>{" "}
          <div className="col-4">
            <h2>Filled</h2>
            {openings?.openingFilledEvents?.map((o, i) => (
              <div key={`opening-filled` + i} className="d-flex flex-row">
                <div className="col-3">{o.inBlock}</div>
                <div className="col-8">{o.groupId}</div>
              </div>
            ))}
          </div>
          <div className="col-4">
            <h2>Canceled</h2>
            {openings?.openingCanceledEvents?.map((o, i) => (
              <div key={`opening-canceled` + i} className="d-flex flex-row">
                <div className="col-3">{o.inBlock}</div>
                <div className="col-8">{o.groupId}</div>
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </Grid>
  );
};

export default Openings;
