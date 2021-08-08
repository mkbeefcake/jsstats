import React from "react";
import LatestPost from "../Forum/LatestPost";
import Loading from "../Loading";

import { Handles, Post, Thread } from "../../types";
import {
  Grid,
  Paper,
  Link,
  makeStyles,
  Theme,
  createStyles,
  Toolbar,
  AppBar,
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
      padding: "10px",
      color: "#fff",
    },
  })
);

const Forum = (props: { posts: Post[]; threads: Thread[] }) => {
  const { posts, threads, startTime } = props;
  const classes = useStyles();
  if (!posts.length) return <Loading target="posts" />;
  return (
    <Grid
      style={{ textAlign: "center", backgroundColor: "#000", color: "#fff" }}
      item
      lg={6}
    >
      <Paper
        style={{
          textAlign: "center",
          backgroundColor: "#4038FF",
          color: "#fff",
          minHeight: 470,
          maxHeight: 600,
          overflow: "auto",
        }}
      >
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h5" className={classes.title}>
              <Link style={{ color: "#fff" }} href={"/forum"}>
                Forum
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>

        {props.posts
          .sort((a, b) => b.id - a.id)
          .slice(0, 10)
          .map((post) => (
            <LatestPost
              key={post.id}
              selectThread={() => {}}
              post={post}
              startTime={startTime}
            />
          ))}
      </Paper>
    </Grid>
  );
};

export default Forum;
