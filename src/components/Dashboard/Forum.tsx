import React from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "react-feather";
import { LatestPost, Spinner } from "..";

import { Post, Thread } from "../../types";
import {
  Grid,
  Paper,
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
  const { handles, posts, threads, startTime } = props;
  const classes = useStyles();

  return (
    <Grid
      style={{ textAlign: "center", backgroundColor: "#000", color: "#fff" }}
      item
      lg={6}
      xs={12}
    >
      <Paper
        style={{
          textAlign: "center",
          backgroundColor: "#4038FF",
          color: "#fff",
          minHeight: 600,
          maxHeight: 600,
          overflow: "auto",
        }}
      >
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h5" className={classes.title}>
              <Link style={{ color: "#fff" }} to={"/forum"}>
                Posts
              </Link>
              <RefreshCw className="ml-2" onClick={props.updateForum} />
            </Typography>
          </Toolbar>
        </AppBar>

        {posts.length ? (
          posts
            .sort((a, b) => b.id - a.id)
            .slice(0, 10)
            .map((post) => (
              <LatestPost
                key={post.id}
                selectThread={() => {}}
                handles={handles}
                post={post}
                thread={threads.find((t) => t.id === post.threadId)}
                startTime={startTime}
              />
            ))
        ) : (
          <Spinner />
        )}
      </Paper>
    </Grid>
  );
};

export default Forum;
