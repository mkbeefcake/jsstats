import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "../../index.css";
import moment from "moment";
import Back from "../Back";
import Loading from "../Loading";

import {
  CalendarItem,
  CalendarGroup,
  ProposalDetail,
  Status,
} from "../../types";

interface IProps {
  proposals: ProposalDetail[];
  status: Status;
  history: any;
}
interface IState {
  items: CalendarItem[];
  groups: CalendarGroup[];
  hide: boolean[];
}

class Calendar extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { items: [], groups: [], hide: [] };
    this.filterItems = this.filterItems.bind(this);
    this.toggleShowProposalType = this.toggleShowProposalType.bind(this);
    this.openItem = this.openItem.bind(this);
  }
  componentDidMount() {
    this.filterItems();
    setInterval(this.filterItems, 5000);
  }

  filterItems() {
    const { status, posts, proposals, threads, handles } = this.props;
    if (!status || !status.council) return [];
    const { hide } = this.state;
    const { startTime, block, council } = status;

    let groups: CalendarGroup[] = [
      { id: 1, title: "RuntimeUpgrade" },
      { id: 2, title: "Council Round" },
      { id: 3, title: "Election" },
    ];
    let items: CalendarItem[] = [];

    const selectGroup = (title: string) => {
      const exists = groups.find((g) => g.title === title);
      if (exists) return exists.id;
      const group = { id: groups.length + 1, title };
      groups.push(group);
      return group.id;
    };

    const getTime = (block: number) =>
      moment(startTime + 6000 * block).valueOf();

    // proposals
    proposals.forEach((p) => {
      if (!p) return;
      const group = selectGroup(`Proposal:${p.type}`);
      if (hide[group]) return;
      const id = `proposal-${p.id}`;
      const route = `/proposals/${p.id}`;
      const title = `${p.id} ${p.title} by ${p.author}`;
      const start_time = moment(startTime + p.createdAt * 6000).valueOf();
      const end_time = p.finalizedAt
        ? moment(startTime + p.finalizedAt * 6000).valueOf()
        : moment().valueOf();
      items.push({ id, route, group, title, start_time, end_time });
    });

    // posts
    posts
      .filter((p) => p.createdAt.block > 1)
      .forEach((p) => {
        if (!p) return;
        const group = selectGroup(`Posts`);
        if (hide[group]) return;
        const id = `post-${p.id}`;
        const route = `/forum/threads/${p.threadId}`;
        const thread = threads.find((t) => t.id === p.threadId) || {};
        const handle = handles[p.authorId];
        const title = `${p.id} in ${thread.title} by ${handle}`;
        const start_time = getTime(p.createdAt.block);
        const end_time = getTime(p.createdAt.block);
        items.push({ id, route, group, title, start_time, end_time });
      });

    // councils
    const stage = council.durations;
    const beforeTerm = stage[0] + stage[1] + stage[2];

    for (let round = 1; round * stage[4] < block.id + stage[4]; round++) {
      const title = `Round ${round}`;
      const route = `/councils`;
      items.push({
        id: `round-${round}`,
        group: 2,
        route,
        title,
        start_time: getTime(beforeTerm + (round - 1) * stage[4]),
        end_time: getTime(beforeTerm + round * stage[4] - 1),
      });
      const startBlock = (round - 1) * stage[4];
      items.push({
        id: `election-round-${round}`,
        group: 3,
        route,
        title: `Election ${title}`,
        start_time: getTime(startBlock),
        end_time: getTime(beforeTerm + startBlock),
      });
    }
    this.setState({ groups, items });
  }
  toggleShowProposalType(id: number) {
    const { hide } = this.state;
    hide[id] = !hide[id];
    this.setState({ hide });
    this.filterItems();
  }
  openItem(id: number) {
    const item = this.state.items.find((i) => i.id === id);
    if (item) this.props.history.push(item.route);
  }

  render() {
    const { hide, groups } = this.state;
    const { history, status } = this.props;

    const items = this.state.items;
    if (!items.length) return <Loading target="items" />;

    const filters = (
      <div className="d-flex flew-row">
        {groups.map((g) => (
          <Button
            key={`button-${g.id}`}
            variant={hide[g.id] ? "secondary" : "dark"}
            className="btn-sm m-0 p-0 pl-1"
            style={{ fontSize: "0.8em" }}
            onClick={() => this.toggleShowProposalType(g.id)}
          >
            {g.title}
          </Button>
        ))}
      </div>
    );

    return (
      <>
        <Link className="back left" to={"/"}>
          <Back history={history} />
        </Link>

        <div>
          <Timeline
            groups={groups.filter((g) => !hide[g.id])}
            items={items}
            sidebarWidth={220}
            sidebarContent={filters}
            stackItems={true}
            defaultTimeStart={moment(status.startTime).add(-1, "day")}
            defaultTimeEnd={moment().add(15, "day")}
            onItemSelect={this.openItem}
          />
        </div>
      </>
    );
  }
}
export default Calendar;
