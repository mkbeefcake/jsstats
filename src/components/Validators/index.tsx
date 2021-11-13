import Content from "./Content";
import { IState } from "../../types";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      width: "100%",
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
    },
    root: { flexGrow: 1, backgroundColor: "#4038FF" },
    title: { textAlign: "left", flexGrow: 1 },
    paper: {
      backgroundColor: "#4038FF",
      color: "#fff",
    },
  })
);

const Validators = (props: IState) => {
  const classes = useStyles();
  return props.showList ? (
    <div className="m-3">
      <Paper className={classes.paper}>
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Validator Stats
            </Typography>
          </Toolbar>
        </AppBar>
        <Content toggleStar={props.toggleStar} {...props} />
      </Paper>
    </div>
  ) : (
    <Grid className={classes.grid} item lg={6}>
      <Paper className={classes.paper}>
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Validator Stats
            </Typography>
          </Toolbar>
        </AppBar>
        <Content toggleStar={props.toggleStar} {...props} />
      </Paper>
    </Grid>
  );
};

export default Validators;
