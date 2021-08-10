import React from "react";
import Content from "./Content";
import { IState } from "../../types";
import {
  AppBar,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "#4038FF",
    },
    title: {
      textAlign: "left",
      flexGrow: 1,
    },
  })
);

const Validators = (props: IState) => {
  const classes = useStyles();

  return (
    <Grid
      style={{
        textAlign: "center",
        backgroundColor: "#000",
        color: "#fff",
      }}
      item
      lg={12}
    >
      <Paper
        style={{
          textAlign: "center",
          backgroundColor: "#4038FF",
          color: "#fff",
          minHeight: 500,
          maxHeight: 500,
          overflow: "auto",
        }}
      >
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography
              className={classes.title}
              variant="h6"
              onClick={() => toggleValidators()}
            >
              Validator Stats
            </Typography>
          </Toolbar>
        </AppBar>

        <Content getMember={props.getMember} {...props} />
      </Paper>
    </Grid>
  );
};

export default Validators;
