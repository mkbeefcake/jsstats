import { Switch, Route, Link } from "react-router-dom";
import {
  Calendar,
  Councils,
  Curation,
  Dashboard,
  Forum,
  Member,
  Members,
  Mint,
  Proposals,
  Proposal,
  Timeline,
  Tokenomics,
  Validators,
  Spending,
  Storage,
  Transactions,
  Bounties,
  Burners,
  ValidatorReport,
} from "..";
import React from "react";
import { AppBar, Button, makeStyles, Toolbar } from "@material-ui/core";
import { MemoryRouter } from "react-router";
import joystream from "../../joystream.svg";
import { IState } from "../../types";

interface IProps extends IState {
  toggleStar: (a: string) => void;
  toggleFooter: () => void;
}

const useStyles = makeStyles({
  appBar: {
    flexDirection: "row",
    backgroundColor: "#000",
    color: "#fff",
  },
  appLogo: {
    display: "block",
    width: "150px",
    color: "#4038ff",
  },
  navbar: {
    "&:hover": {
      backgroundColor: "#4038ff",
    },
  },
});

const Routes = (props: IProps) => {
  const classes = useStyles();
  const navBarLink = { color: "#fff" };
  const { reports, tokenomics } = props;

  return (
    <div>
      <MemoryRouter>
        <div style={{ flexGrow: 1 }}>
          <AppBar position="static" className={classes.appBar}>
            <Toolbar style={{ paddingLeft: "12px", backgroundColor: "#000" }}>
              <Button color="inherit" component={Link} to="/">
                <img
                  src={joystream}
                  className={classes.appLogo}
                  alt="Joystream logo"
                />
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/dashboard"
              >
                Dashboard
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/calendar"
              >
                Calendar
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/timeline"
              >
                Timeline
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/tokenomics"
              >
                Reports
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/validators"
              >
                Validators
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/validator-report"
              >
                Validator Report
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/storage"
              >
                Storage
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/spending"
              >
                Spending
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/transactions"
              >
                Transfers
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/burners"
              >
                Top Burners
              </Button>
              <Button
                className={classes.navbar}
                style={navBarLink}
                component={Link}
                to="/mint"
              >
                Toolbox
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <div>
          <Switch>
            <Route
              path="/tokenomics"
              render={(routeprops) => (
                <Tokenomics
                  {...routeprops}
                  reports={reports}
                  tokenomics={tokenomics}
                />
              )}
            />
            <Route
              path="/spending"
              render={(routeprops) => <Spending {...routeprops} {...props} />}
            />
            <Route
              path="/proposals/:id"
              render={(routeprops) => <Proposal {...routeprops} {...props} />}
            />
            <Route path="/proposals" render={() => <Proposals {...props} />} />
            <Route
              path="/councils"
              render={(routeprops) => <Councils {...routeprops} {...props} />}
            />
            <Route
              path="/curation"
              render={(routeprops) => <Curation {...routeprops} {...props} />}
            />
            <Route
              path="/forum/threads/:thread"
              render={(routeprops) => <Forum {...routeprops} {...props} />}
            />
            <Route path="/forum" render={() => <Forum {...props} />} />
            <Route
              path="/mint"
              render={(routeprops) => <Mint {...routeprops} {...props} />}
            />
            <Route
              path="/members/:handle"
              render={(routeprops) => <Member {...routeprops} {...props} />}
            />
            <Route
              path="/members"
              render={(routeprops) => <Members {...routeprops} {...props} />}
            />
            <Route
              path="/calendar"
              render={(routeprops) => <Calendar {...routeprops} {...props} />}
            />
            <Route
              path="/timeline"
              render={(routeprops) => <Timeline {...routeprops} {...props} />}
            />
            <Route
              path="/validators"
              render={(routeprops) => <Validators {...routeprops} {...props} />}
            />
            <Route
              path="/validator-report"
              render={(routeprops) => (
                <ValidatorReport {...routeprops} {...props} />
              )}
            />
            <Route
              path="/storage"
              render={(routeprops) => <Storage {...routeprops} {...props} />}
            />
            <Route
              path="/transactions"
              render={(routeprops) => (
                <Transactions {...routeprops} {...props} />
              )}
            />
            <Route
              path="/bounties"
              render={(routeprops) => <Bounties {...routeprops} {...props} />}
            />
            <Route
              path="/burners"
              render={(routeprops) => <Burners {...routeprops} {...props} />}
            />
            <Route path="/" render={() => <Dashboard {...props} />} />
          </Switch>
        </div>
      </MemoryRouter>
    </div>
  );
};

export default Routes;
