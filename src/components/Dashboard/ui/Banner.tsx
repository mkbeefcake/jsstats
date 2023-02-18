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
import Line from "./Line";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: { textAlign: "center", backgroundColor: "#000", color: "#fff" },
    root: { flexGrow: 1, backgroundColor: "#4038FF", boxShadow: "none", paddingLeft:"16px"  },
    title: { textAlign: "left", flexGrow: 1, color: '#000' },
    toolbar: { minHeight:'40px' },
    description: { textAlign: "left", flexGrow: 1, color: '#000', 
        paddingLeft:"16px", paddingRight:"16px", paddingTop:"8px", paddingBottom:"8px"
    },
    paper: {
      textAlign: "center",
      backgroundColor: "#4038FF",
      color: "#fff",
      minHeight: 50,
      maxHeight: 200,
      overflow: "auto",
      paddingTop:"6px",
      paddingBottom:"6px"
    },
  })
);

const Banner = (props: {
  title: string;
  description: string;
}) => {
  const { 
    title,
    description
  } = props;
  const classes = useStyles();

  return (
    <Grid className={classes.grid} item xs={12}>
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
        <i>
          <Line content={description} />
        </i>
        {/* <Typography variant="body1" className={classes.description}>
            {description}
        </Typography> */}
      </Paper>
    </Grid>
  );
};

export default Banner;
