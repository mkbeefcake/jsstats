import React from "react";
import { Button } from "react-bootstrap";
import Ranking from "./Ranking";

import moment from "moment";
import Test from "./Test";
import axios from "axios";

interface IProps {
  assets: string[];
  providers: any[];
  tokenomics: {
    media: { channels: number; size: number; media_files: number };
  };
}
interface IState {}

class Storage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      startedAt: false,
      selectedAssets: [],
      hash: "",
      number: 10,
      loading: {},
      assets: [],
      speeds: {},
      showTest: false,
    };
    this.startTest = this.startTest.bind(this);
    this.setAssetStatus = this.setAssetStatus.bind(this);
    this.toggleShowTest = this.toggleShowTest.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchSpeeds();
    //setInterval(this.forceUpdate, 5000);
  }

  async fetchSpeeds() {
    const { data } = await axios.get(`/static/speeds2.json`);
    if (data.error) return;
    console.log(`received results for`, Object.keys(data).join(`, `));
    this.setState({ speeds: data });
  }

  toggleShowTest() {
    this.setState({ showTest: !this.state.showTest });
  }

  async startTest(test: number) {
    const { hash, number } = this.state;
    const { assets, providers } = this.props;
    const loading = {};
    let selectedAssets = [];

    if (test === 1) {
      selectedAssets.push(assets[0]);
      selectedAssets.push(hash);
      return this.setState({ loading, startedAt: moment(), selectedAssets });
    }

    for (let i = 0; i < number; i++) {
      const id = Math.round(Math.random() * assets.length);
      const asset = assets.slice(id, id + 1)[0];

      if (selectedAssets.find((a) => a === asset)) i--;
      else selectedAssets.push(asset);
    }
    loading[`${providers[0].url}-${selectedAssets[0]}`] = "loading";
    await this.setState({ loading, startedAt: moment(), selectedAssets });
    this.loadWaitingAsset(selectedAssets, providers);
  }

  setAssetStatus(id: string, provider: string, status: string) {
    console.debug(id, provider, status);
    const tag = `${provider}-${id}`;
    const { loading } = this.state;

    if (status === `loading`)
      loading[tag] = { provider, id, status, startedAt: moment() };
    else {
      loading[tag].finishedAt = moment();
      loading[tag].status = status;
      this.loadWaitingAsset();
    }
    this.setState({ loading });
  }
  loadWaitingAsset(
    selectedAssets = this.state.selectedAssets,
    providers = this.props.providers
  ) {
    const { loading } = this.state;
    let provider: string;
    const asset = selectedAssets.find((a) => {
      const waiting = providers.find((p) =>
        loading[`${p.url}-${a}`] ? false : true
      );
      if (!waiting) return false;
      provider = waiting.url;
      return true;
    });

    if (!asset) return this.testFinished();
    this.setAssetStatus(asset, provider, "loading");
  }
  testFinished() {
    console.log(`test finished`);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const {
      speeds,
      selectedAssets,
      hash,
      number,
      loading,
      showTest,
    } = this.state;
    const { providers, assets, tokenomics } = this.props;

    return (
      <div className="m-2 p-2 bg-light">
        <h2>Storage Providers</h2>
        {tokenomics ? (
          <div className="m-2 p-2">
            <div>Files: {tokenomics.media.media_files}</div>
            <div>Size: {(tokenomics.media.size / 1000000000).toFixed()} GB</div>
          </div>
        ) : (
          <div />
        )}

        <ul>
          <li>
            <a href="/static/helios">HELIOS reports</a>
          </li>
        </ul>

        {showTest ? (
          <Test
            handleChange={this.handleChange}
            startTest={this.startTest}
            setAssetStatus={this.setAssetStatus}
            assets={assets}
            hash={hash}
            loading={loading}
            number={number}
            providers={providers}
            selectedAssets={selectedAssets}
          />
        ) : (
          <Button
            variant="outline-dark float-right"
            onClick={this.toggleShowTest}
          >
            Perform your own test
          </Button>
        )}

        <h3>Ranking</h3>
        <div className="d-flex flex-wrap ">
          {Object.keys(speeds).map((location) => (
            <Ranking
              key={location}
              location={location}
              providers={speeds[location]}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Storage;
