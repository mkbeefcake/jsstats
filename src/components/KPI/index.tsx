import { Component } from "react";
import { Button } from "react-bootstrap";
import { Typography } from "@material-ui/core";
import { Loading } from "..";
import axios from "axios";

import Leaderboard from "./Leaderboard";
import Round from "./Round";

const baseUrl = `https://joystreamstats.live/static`;

class KPI extends Component {
  constructor(props: { tokenomics: Tokenomics }) {
    super(props);
    this.state = { rounds: [], leaderboard: [] };
    this.fetchKpi = this.fetchKpi.bind(this);
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this);
    this.toggleEditKpi = this.toggleEditKpi.bind(this);
    this.toggleShowLeaderboard = this.toggleShowLeaderboard.bind(this);
  }
  componentDidMount() {
    this.fetchKpi();
    //this.fetchLeaderboard()
  }
  fetchKpi() {
    axios
      .get(`${baseUrl}/kpi.json`)
      .then(({ data }) => data.rounds && this.setState({ rounds: data.rounds }))
      .catch((e) => console.error(`Failed to fetch KPI data.`, e));
  }
  fetchLeaderboard() {
    axios
      .get(`${baseUrl}/leaderboard.json`)
      .then((res) => this.setState({ leaderboard: res.data }))
      .catch((e) => console.error(`Failed to fetch Leadboard data.`, e));
  }

  toggleShowLeaderboard() {
    this.setState({ showLeaderboard: !this.state.showLeaderboard });
  }
  toggleEditKpi(edit) {
    this.setState({ edit });
  }
  focus(id) {
    document.getElementById(id)?.scrollIntoView();
  }

  render() {
    const { edit, rounds, leaderboard, showLeaderboard } = this.state;
    if (!rounds.length) return <Loading target="KPI" />;
    return (
      <div className="m-3 p-2 text-light">
        <Typography variant="h2" className="mb-3">
          KPI
        </Typography>

        <Button
          variant="outline-secondary"
          className="p-1 btn-sm"
          onClick={this.toggleShowLeaderboard}
        >
          Leaderboard
        </Button>

        {showLeaderboard ? (
          <Leaderboard
            leaderboard={leaderboard}
            tokenomics={this.props.tokenomics}
          />
        ) : (
          <div className="d-flex flex-row py-2">
            <div className="justify-content-start mr-3">
              {rounds.map(({ round }) => (
                <Button
                  variant="outline-secondary"
                  className="mb-1 p-1 flex-grow-0"
                >
                  {round}
                </Button>
              ))}
            </div>

            <Round
              round={rounds[0]}
              edit={edit}
              fetchKpi={this.fetchKpi}
              toggleEdit={this.toggleEditKpi}
              focus={this.focus}
            />
          </div>
        )}
      </div>
    );
  }
}

export default KPI;
