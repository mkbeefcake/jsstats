import React from "react";
import {
  Paper,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  Toolbar,
  Typography,
  AppBar,
} from "@material-ui/core";
import { IState } from "../../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: { textAlign: "center", backgroundColor: "#000", color: "#fff" },
    root: { flexGrow: 1, backgroundColor: "#4038FF", boxShadow: "none", paddingLeft:"16px" },
    title: { textAlign: "left", flexGrow: 1, color: '#000' },
    toolbar: { minHeight:'40px' },
    paper: {
      textAlign: "center",
      backgroundColor: "#4038FF",
      color: "#fff",
      minHeight: 100,
      maxHeight: 400,
      overflow: "auto",
      paddingTop:"6px",
      paddingBottom:"6px"
    },
  })
);

const SubBlock = (props: {
  title: string,
  children: any
}) => {
  const { 
    title,
    children
  } = props;
  const classes = useStyles();

  return (
    <Grid className={classes.grid} item xs={4} md={4} sm={12}>
      <Paper className={classes.paper}>
        { title && 
          <AppBar className={classes.root} position="static">
            <Toolbar disableGutters={true} className={classes.toolbar}>
              <Typography variant="h6" className={classes.title}>
                {title}
              </Typography>
            </Toolbar>
          </AppBar>
        }
        {children}
      </Paper>
    </Grid>
  );
};

export default SubBlock;
