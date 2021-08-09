import { Component } from "react";
import { Button } from "react-bootstrap";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "../../index.css";
import moment from "moment";
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
    const { status, councils, posts, proposals, threads } = this.props;
    if (!status?.council) return [];
    const { hide } = this.state;

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
      moment(status.startTime + 6000 * block).valueOf();

    // proposals
    proposals.forEach((p) => {
      if (!p) return;
      const group = selectGroup(`Proposal:${p.type}`);
      if (hide[group]) return;
      const id = `proposal-${p.id}`;
      const route = `/proposals/${p.id}`;
      const title = `${p.id} ${p.title} by ${p.author.handle}`;
      const start_time = getTime(p.createdAt);
      const end_time = p.finalizedAt
        ? getTime(p.finalizedAt)
        : moment().valueOf();
      items.push({ id, route, group, title, start_time, end_time });
    });

    // posts
    posts
      .filter((p) => p.createdAt > 1)
      .forEach((p) => {
        if (!p) return;
        const group = selectGroup(`Posts`);
        if (hide[group]) return;
        const id = `post-${p.id}`;
        const route = `/forum/threads/${p.threadId}`;
        const thread = threads.find((t) => t.id === p.threadId) || {};
        const title = `${p.id} in ${thread.title} by ${p.author.handle}`;
        const start_time = getTime(p.createdAt);
        const end_time = getTime(p.createdAt);
        items.push({ id, route, group, title, start_time, end_time });
      });

    // councils
    const d = status.election.durations;
    councils.forEach((c) => {
      const title = `Round ${c.round}`;
      const route = `/councils`;

      items.push({
        id: `round-${c.round}`,
        group: 2,
        route,
        title,
        start_time: getTime(c.start + d[1] + d[2]),
        end_time: getTime(c.end + d[0] + d[1] + d[2]),
      });

      items.push({
        id: `election-round-${c.round}`,
        group: 3,
        route,
        title: `Election ${title}`,
        start_time: getTime(c.start - d[0]),
        end_time: getTime(c.start + d[1] + d[2]),
      });
    });
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
    const items = this.state.items;
    if (!items.length) return <Loading target="items" />;

    const { status } = this.props;

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
    );
  }
}
export default Calendar;
