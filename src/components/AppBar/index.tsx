import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Button, makeStyles, Toolbar } from "@material-ui/core";
import joystream from "../../joystream.svg";

import { css, routes } from "./config";

const useStyles = makeStyles(css);

const Bar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar style={css.toolBar}>
        <Button color="inherit" component={Link} to="/">
          <img
            src={joystream}
            className={classes.appLogo}
            alt="Joystream logo"
          />
        </Button>

        {Object.keys(routes).map((route) => (
          <Button
            key={route}
            className={classes.navBar}
            style={css.navBarLink}
            component={Link}
            to={"/" + route}
          >
            {routes[route]}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Bar;
