import React from "react";
import { Button } from "react-bootstrap";
import Ranking from "./Ranking";
import Back from "../Back";

import moment from "moment";
import Test from "./Test";
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
      showTest: false,
    };
    this.startTest = this.startTest.bind(this);
    this.loadAsset = this.loadAsset.bind(this);
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
      showTest,
    } = this.state;
    const { providers, assets } = this.props;

    //if (!providers.length) return <Loading target="storage providers" />;
    //if (!assets.length) return <Loading target="assets" />;

    return (
      <div className="m-2 p-2 bg-light">
        <h2>Storage Providers Ranking</h2>

        {showTest ? (
          <Test />
        ) : (
          <Button variant="outline-dark float-right">
            Perform your own test
          </Button>
        )}

        <div className="d-flex flex-wrap ">
          {Object.keys(speeds).map((location) => (
            <Ranking
              key={location}
              location={location}
              providers={speeds[location]}
            />
          ))}
        </div>

        <Back />
      </div>
    );
  }
}

export default Storage;
