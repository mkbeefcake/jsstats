import { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Button, SwipeableDrawer, Toolbar } from "@material-ui/core";
import SelectLanguage from "./SelectLanguage";
import joystream from "../../joystream.svg";
import MenuIcon from "@material-ui/icons/Menu";
import { routes, useStyles } from "./config";

const Bar = () => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Button className={classes.menuButton} onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </Button>
        <Button fullWidth className={classes.appLogo} component={Link} to="/">
          <img src={joystream} alt="Joystream logo" />
        </Button>
        <SwipeableDrawer
          anchor={"left"}
          open={menuOpen}
          onOpen={() => setMenuOpen(true)}
          onClose={() => setMenuOpen(false)}
          className={classes.drawer}
        >
          <Button className={classes.appLogo} component={Link} to="/">
            <img src={joystream} alt="Joystream logo" />
          </Button>
          {Object.keys(routes).map((route) => (
            <Button
              key={route}
              className={classes.root}
              component={Link}
              onClick={() => setMenuOpen(false)}
              to={"/" + route}
            >
              {routes[route]}
            </Button>
          ))}
          <SelectLanguage />
        </SwipeableDrawer>
      </Toolbar>
    </AppBar>
  );
};

export default Bar;
