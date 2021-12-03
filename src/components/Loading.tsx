import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { Grid } from "@material-ui/core";
import { GridSize } from "@material-ui/core/Grid/Grid";

const Loading = (props: { target?: string; gridSize?: GridSize }) => {
  const { gridSize, target } = props;
  const title = target ? `Fetching ${target}` : "Connecting to Websocket";
  return (
    <Grid style={{ textAlign: "center" }} lg={gridSize ? gridSize : 6} item>
      <Button variant="warning" className="m-1 py-0 mr-2 mt-3">
        <Spinner animation="border" variant="dark" size="sm" className="mr-1" />
        {title}
      </Button>
    </Grid>
  );
};

export default Loading;
