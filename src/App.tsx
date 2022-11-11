import React from "react";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import {
  Log,
  NavBar,
  Modals,
  Routes,
  Loading,
  Status,
  Notes,
} from "./components";
import { initialState } from "./state";
import { BrowserRouter } from "react-router-dom";
import { IState } from "./types";
//import api from '.api/'
import { postQN } from "./lib/util";

interface IProps {}

class App extends React.Component<IProps, IState> {
  //private socket = this.initializeSocket(); // jsstats socket.io

  initializeSocket() {
    socket.on("disconnect", () => setTimeout(this.initializeSocket, 1000));
    socket.on("connect", () => {
      if (!socket.id) return console.log("no websocket connection");
      console.log("my socketId:", socket.id);
      socket.emit("get posts", this.state.posts.length);
    });
    socket.on("posts", (posts: Post[]) => {
      console.log(`received ${posts.length} posts`);
      this.setState({ posts });
    });
  }

  log(level, msg, data) {
    if (!msg) return console.error(`log called with empty msg`);
    const now = moment().valueOf();
    const time = this.state.settings.logTimestamps ? now : "";
    this.setState({
      log: this.state.log.concat({ time: now, msg, data, level }),
    });
    if (level === "e") return console.error(time, msg, data ? data : null);
    if (level === "w") return console.warn(time, msg, data ? data : null);
    if (level === "i") return console.log(time, msg, data ? data : null);
    console.debug(time, msg, data ? data : null);
  }

  // interface interactions

  toggleStar(account: string) {
    let { stars } = this.state;
    stars[account] = !stars[account];
    this.save("stars", stars);
  }

  toggleEditKpi(editKpi) {
    this.setState({ editKpi });
  }
  toggleShowStatus() {
    this.setState({ showStatus: !this.state.showStatus });
  }
  toggleFooter() {
    this.setState({ hideFooter: !this.state.hideFooter });
  }
  toggleShowNotes() {
    let { settings } = this.state;
    settings.showNotes = !settings.showNotes;
    this.save("settings", settings);
  }
  selectVideo(video) {
    this.setState({ video });
  }

  render() {
    const { log, settings, connected, fetching, loading } = this.state;
    if (loading) return <Loading />;

    return (
      <BrowserRouter>
        <NavBar toggleShowNotes={this.toggleShowNotes} />

        <div
          className="d-flex flex-row overflow-hidden w-100 h-100"
          style={{ maxHeight: "95vh" }}
        >
          <Notes
            addNote={this.addNote}
            save={this.save}
            notes={this.state.notes}
            note={this.state.note}
            settings={settings}
            log={this.log}
          />
          <div className="d-flex flex-column-reverse">
            <Log log={log} settings={settings} save={this.save} />
            <div className="overflow-auto">
              <Routes
                selectEvent={this.selectEvent}
                selectVideo={this.selectVideo}
                toggleEditKpi={this.toggleEditKpi}
                toggleFooter={this.toggleFooter}
                toggleStar={this.toggleStar}
                fetchQuery={this.fetchQuery}
                saveQuery={this.saveQuery}
                save={this.save}
                hidden={this.state.hidden}
                {...this.state}
              />
            </div>
          </div>
        </div>

        <Modals
          selectEvent={this.selectEvent}
          selectVideo={this.selectVideo}
          toggleEditKpi={this.toggleEditKpi}
          toggleShowStatus={this.toggleShowStatus}
          {...this.state}
        />

        <Status
          toggleShowStatus={this.toggleShowStatus}
          connected={connected}
          fetching={fetching}
        />
      </BrowserRouter>
    );
  }

  // startup from bottom up
  selectEvent(selectedEvent) {
    this.setState({ selectedEvent });
  }

  handleKey(e: any) {
    console.debug(`pressed`, e.key);
    if (e.key === "-") {
      if (this.state.video) this.selectVideo(+this.state.video - 1);
    }
    if (e.key === "+") {
      if (this.state.video) this.selectVideo(+this.state.video + 1);
    }
  }

  // data handling

  updateQueries() {
    for (const [name, hours, query, active] of this.state.queries) {
      if (!active) continue;
      const data = this.state[name];
      const isEmpty = !data || !Object.keys(data).length;
      const hoursPassed = moment().diff(data?.timestamp, "hours");
      const needsUpdate = isEmpty || !data?.timestamp || hours === hoursPassed;
      if (needsUpdate) this.fetchQuery(name, query);
      else this.log("d", `${name} up to date (${hoursPassed}/${hours}h)`);
    }
    setTimeout(this.updateQueries, 60000);
  }
  async fetchQuery(name, query) {
    this.log("i", `Updating ${name}.`);
    let result = await postQN(query);
    if (!result) return;
    if (result.error) {
      this.log("w", `query ${name} failed: ${result.error}`);
      return;
    }
    result.timestamp = moment().valueOf();
    this.save(name, result);
  }
  saveQuery(query) {
    const queries = this.state.queries.map((q) =>
      q[0] === query[0] ? query : q
    );
    this.save("queries", queries);
    console.debug(new Date(), "saved queries");
  }

  save(key: string, data: any) {
    this.setState({ [key]: data });
    const value = JSON.stringify(data);
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      const size = value.length / 1024;
      console.warn(`Failed to save ${key} (${size.toFixed()} KB)`, e.message);
      if (key === "blocks") this.load(key);
      else this.setState({ syncEvents: false });
    }
    return data;
  }

  load(key: string) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return; //console.debug(`loaded empty`, key);
      const size = data.length;
      if (size > 5000)
        console.debug(` -${key}: ${(size / 1024).toFixed(1)} KB`);
      let loaded = JSON.parse(data);
      this.setState({ [key]: loaded });
      return loaded;
    } catch (e) {
      console.warn(`Failed to load ${key}`, e);
    }
  }

  async loadData() {
    // from local storage
    console.debug(`Loading data`);
    "settings showNotes notes scores status members assets providers buckets councils council election workers categories grading proposals openings tokenomics transactions reports validators nominators staches stakes rewardPoints stars blocks hidden media"
      .split(" ")
      .map((key) => this.load(key));
    const queries = this.load("queries") || this.state.queries;
    return queries.map(([name]) => this.load(name));
  }

  async componentDidMount() {
    this.loadData().then(() => this.updateQueries());

    //setInterval(this.updateQueries, 60000);
    //window.addEventListener("keypress", this.handleKey);
    //getTokenomics().then((tokenomics) => this.save(`tokenomics`, tokenomics));
    //bootstrap(this.save); // axios requests
    //this.updateCouncils();
  }

  constructor(props: IProps) {
    super(props);
    this.state = initialState;
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.toggleEditKpi = this.toggleEditKpi.bind(this);
    this.toggleStar = this.toggleStar.bind(this);
    this.toggleFooter = this.toggleFooter.bind(this);
    this.toggleShowStatus = this.toggleShowStatus.bind(this);
    //this.getMember = this.getMember.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
    this.selectVideo = this.selectVideo.bind(this);
    this.handleKey = this.handleKey.bind(this);

    // queries
    this.updateQueries = this.updateQueries.bind(this);
    this.fetchQuery = this.fetchQuery.bind(this);
    this.saveQuery = this.saveQuery.bind(this);
    this.toggleShowNotes = this.toggleShowNotes.bind(this);
    this.log = this.log.bind(this);
  }
}

export default App;
