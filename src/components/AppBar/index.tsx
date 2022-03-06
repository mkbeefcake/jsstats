//import { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Button, Toolbar } from "@material-ui/core";
import joystream from "../../joystream.svg";
import { useStyles } from "./config";

const Bar = () => {
  const classes = useStyles();
  //const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Button fullWidth className={classes.appLogo} component={Link} to="/">
          <img src={joystream} alt="Joystream logo" />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Bar;
