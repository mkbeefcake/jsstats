import React from "react";
import { Button } from "react-bootstrap";
import Loading from "../Loading";
import moment from "moment";
import Provider from "./Provider";

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
      number: 1,
      loading: {},
      assets: [],
    };
    this.startTest = this.startTest.bind(this);
    this.loadAsset = this.loadAsset.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    //setInterval(this.forceUpdate, 5000);
  }

  startTest() {
    const { number } = this.state;
    const { assets } = this.props;
    const selectedAssets = [];
    for (let i = 0; i < number; i++) {
      const id = Math.round(Math.random() * assets.length);
      const asset = assets.slice(id, id + 1)[0];

      console.log(id, asset, selectedAssets);

      if (selectedAssets.find((a) => a === asset)) i--;
      else selectedAssets.push(asset);
    }
    this.setState({ loading: {}, startedAt: moment(), selectedAssets });
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
    const { selectedAssets, number, loading, startedAt } = this.state;
    const { providers, assets } = this.props;

    if (!providers.length) return <Loading target="storage providers" />;
    if (!assets.length) return <Loading target="assets" />;

    return (
      <div className="p-3 text-light">
        <h2>Storage Providers</h2>
        <div className="d-flex flex-row mb-2">
          <input
            className="mr-1"
            name="number"
            value={number}
            onChange={this.handleChange}
          />
          <Button variant="warning" onClick={this.startTest}>
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

        <div className="position-fixed" style={{ right: "0px", top: "0px" }}>
          <a href="/">Back</a>
        </div>
      </div>
    );
  }
}

export default Storage;
