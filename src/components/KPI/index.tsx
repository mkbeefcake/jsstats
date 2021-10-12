import { Component } from "react";
import { Link } from "react-router-dom";
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
    this.state = { round: null, rounds: [], leaderboard: [] };
    this.fetchKpi = this.fetchKpi.bind(this);
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this);
    this.toggleShowLeaderboard = this.toggleShowLeaderboard.bind(this);
  }
  componentDidMount() {
    this.fetchKpi();
    //this.fetchLeaderboard()
  }
  fetchKpi() {
    axios
      .get(`${baseUrl}/kpi.json`)
      .then(({ data }) => {
        const rounds = data.rounds;
        console.debug(`Received KPI for ${rounds.length} round(s).`);
        const round = rounds.reduce(
          (r, max) => (r.round > max.round ? r : max),
          rounds[0]
        );
        this.setState({ rounds, round });
      })
      .catch((e) => console.error(`Failed to fetch KPI data.`, e));
  }
  fetchLeaderboard() {
    axios
      .get(`${baseUrl}/leaderboard.json`)
      .then((res) => this.setState({ leaderboard: res.data }))
      .catch((e) => console.error(`Failed to fetch Leadboard data.`, e));
  }

  selectRound(selectedRound: number) {
    this.setState({ selectedRound, showLeaderboard: false });
  }
  toggleShowLeaderboard() {
    this.setState({ showLeaderboard: !this.state.showLeaderboard });
  }
  focus(id) {
    document.getElementById(id)?.scrollIntoView();
  }

  render() {
    const { round, rounds, leaderboard, showLeaderboard } = this.state;
    if (!round) return <Loading target="KPI" />;
    return (
      <div className="m-3 p-2 text-light">
        <div className="d-flex flex-row">
          <Button
            variant={showLeaderboard ? "light" : "outline-secondary"}
            className="p-1 btn-sm"
            onClick={this.toggleShowLeaderboard}
          >
            Leaderboard
          </Button>
          <Link
            to={`/bounties`}
            className="mx-2 p-1 btn btn-sm btn-outline-secondary"
          >
            Bounties
          </Link>
          <Link to={`/issues`} className="p-1 btn btn-sm btn-outline-secondary">
            Operations Tasks
          </Link>
        </div>

        <Typography variant="h2" className="mt-3">
          KPI
        </Typography>

        <div className="d-flex flex-wrap">
          {rounds.map((r) => (
            <Button
              key={r.round}
              variant={r.round === round.round ? "light" : "outline-light"}
              className="ml-1 p-1 flex-grow-0"
              onClick={() => this.selectRound(round)}
            >
              {r.round}
            </Button>
          ))}
        </div>

        {showLeaderboard ? (
          <Leaderboard
            leaderboard={leaderboard}
            tokenomics={this.props.tokenomics}
          />
        ) : (
          <Round
            round={round}
            fetchKpi={this.fetchKpi}
            focus={this.focus}
            toggleEditKpi={this.props.toggleEditKpi}
          />
        )}
      </div>
    );
  }
}

export default KPI;
