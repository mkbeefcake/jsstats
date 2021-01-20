import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "../../index.css";
import moment from "moment";
import Back from "../Back";
import Loading from "../Loading";

import { CalendarItem, CalendarGroup, ProposalDetail } from "../../types";

interface IProps {
  proposals: ProposalDetail[];
  now: number;
  block: number;
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
    this.toggleShowProposalType = this.toggleShowProposalType.bind(this);
  }

  componentDidMount() {
    this.filterItems();
  }

  filterItems() {
    const { block, now, proposals } = this.props;
    const { hide } = this.state;
    const startTime = now - block * 6000;
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

    proposals.forEach((p) => {
      if (!p) return;
      const group = selectGroup(p.type);
      if (hide[group]) return;
      items.push({
        id: p.id,
        group: selectGroup(p.type),
        title: `${p.id} ${p.title}`,
        start_time: moment(startTime + p.createdAt * 6000).valueOf(),
        end_time: p.finalizedAt
          ? moment(startTime + p.finalizedAt * 6000).valueOf()
          : moment().valueOf(),
      });
    });

    const announcing = 28800;
    const voting = 14400;
    const revealing = 14400;
    const termDuration = 144000;
    const cycle = termDuration + announcing + voting + revealing;
    this.setState({ groups, items });

    for (let round = 1; round * cycle < block + cycle; round++) {
      items.push({
        id: items.length + 1,
        group: 2,
        title: `Round ${round}`,
        start_time: moment(
          startTime + 6000 * (57601 + (round - 1) * cycle)
        ).valueOf(),
        end_time: moment(
          startTime + 6000 * (57601 + round * cycle - 1)
        ).valueOf(),
      });
      items.push({
        id: items.length + 1,
        group: 3,
        title: `Election Round ${round}`,
        start_time: moment(startTime + 6000 * ((round - 1) * cycle)).valueOf(),
        end_time: moment(
          startTime + 6000 * (57601 + (round - 1) * cycle)
        ).valueOf(),
      });
    }
    this.setState({ items });
  }
  toggleShowProposalType(id: number) {
    const { hide } = this.state;
    hide[id] = !hide[id];
    this.setState({ hide });
    this.filterItems();
  }

  render() {
    const { hide, items, groups } = this.state;

    const first = items.sort((a, b) => a.end_time - b.end_time)[0];

    if (!items.length) return <Loading />;

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
      <div>
        <Timeline
          groups={groups.filter((g) => !hide[g.id])}
          items={items}
          sidebarWidth={220}
          sidebarContent={filters}
          stackItems={true}
          defaultTimeStart={moment(first.start_time).add(-1, "day")}
          defaultTimeEnd={moment().add(15, "day")}
        />
        <div className="position-fixed" style={{ left: "0", bottom: "0" }}>
          <Back />
        </div>
      </div>
    );
  }
}
export default Calendar;
