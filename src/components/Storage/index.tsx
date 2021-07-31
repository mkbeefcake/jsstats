import React from "react";
import { Button } from "react-bootstrap";
import Loading from "../Loading";
import moment from "moment";
import Provider from "./Provider";
import axios from "axios";

interface IProps {
  assets: string[];
  providers: any[];
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
    };
    this.startTest = this.startTest.bind(this);
    this.loadAsset = this.loadAsset.bind(this);
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

  startTest(test: number) {
    const { hash, number } = this.state;
    const { assets } = this.props;
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
    this.setState({ loading, startedAt: moment(), selectedAssets });
  }

  loadAsset(id: string, provider: string, status: string) {
    let { startedAt } = this.state;
    const tag = `${provider}-${id}`;
    const value =
      status === `loading`
        ? { provider, id, status, startedAt }
        : { provider, id, status, finishedAt: moment() };

    const { loading } = this.state;
    loading[tag] = value;
    this.setState({ loading });
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
      startedAt,
    } = this.state;
    const { providers, assets } = this.props;

    if (!providers.length) return <Loading target="storage providers" />;
    if (!assets.length) return <Loading target="assets" />;

    return (
      <div className="m-2 p-2 bg-light">
        <h2>Storage Providers</h2>
        <div className="form-group">
          <input
            className="form-control"
            name="hash"
            value={hash}
            onChange={this.handleChange}
          />
          <Button
            variant="success"
            onClick={() => this.startTest(1)}
            disabled={hash === ``}
          >
            Test selected resource
          </Button>
        </div>
        <div className="form-group">
          <input
            className="form-control"
            name="number"
            value={number}
            onChange={this.handleChange}
          />
          <Button variant="warning" onClick={() => this.startTest(2)}>
            Test {number} out of {assets.length} assets
          </Button>
        </div>

        {(providers.length &&
          providers.map((p) => (
            <Provider
              key={p.url}
              loadAsset={this.loadAsset}
              test={selectedAssets}
              loading={loading}
              startedAt={startedAt}
              {...p}
            />
          ))) || <Loading target="provider list" />}

        <h2>Latest Speed Test</h2>
        <div className="d-flex flex-wrap ">
          {Object.keys(speeds).map((location) => (
            <Location
              key={location}
              location={location}
              providers={speeds[location]}
            />
          ))}
        </div>

        <div className="position-fixed" style={{ right: "0px", top: "0px" }}>
          <a href="/">Back</a>
        </div>
      </div>
    );
  }
}

export default Storage;

interface Asset {
  provider: string;
  timestamp: string;
  asset: string;
  speed: {
    dnslookup: number;
    connect: number;
    appconnect: number;
    pretransfer: number;
    redirect: number;
    starttransfer: number;
    total: number;
    size: number;
  };
}

const calculateSpeed = (provider: Asset[]) => {
  let transferred: number = 0;
  let duration: number = 0;
  let assets: string[] = [];
  let url: string;
  provider.map(({ speed, provider, asset }: Asset) => {
    const { total, size } = speed;
    transferred += size / 1000000;
    duration += total;
    assets.push(asset);
    url = provider;
  });
  const speed = transferred / duration;
  return { transferred, duration, assets, speed, url };
};

const Location = (props: { location: string; providers: any[] }) => {
  const { location, providers } = props;
  const speeds = providers.map((provider) => calculateSpeed(provider));
  const sorted = speeds.sort((a, b) => b.speed - a.speed);
  //console.log(location, sorted);
  return (
    <div className="col-3 mb-3">
      <h3>{location}</h3>
      {sorted
        .slice(0, 5)
        .map(({ url, assets, speed, duration, transferred }, i: number) => (
          <div key={url} className="mb-1">
            <b>
              {i + 1}. {url}
            </b>
            <div>speed: {speed.toFixed()} mb/s</div>
            <div>transferred: {transferred.toFixed()} mb</div>
            <div>duration: {duration.toFixed()} s</div>
          </div>
        ))}
    </div>
  );
};
