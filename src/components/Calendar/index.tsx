import React from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "../../index.css";
import moment from "moment";
import Back from "../Back";

import { CalendarItem, CalendarGroup, ProposalDetail } from "../../types";

const Calendar = (props: {
  proposals: ProposalDetail[];
  now: number;
  block: number;
}) => {
  const { block, now, proposals } = props;

  const startTime = now - block * 6000;
  let groups: CalendarGroup[] = [{ id: 1, title: "RuntimeUpgrade" }];
  let items: CalendarItem[] = [];

  const selectGroup = (title: string) => {
    const exists = groups.find((g) => g.title === title);
    if (exists) return exists.id;
    const group = { id: groups.length + 1, title };
    groups.push(group);
    return group.id;
  };

  proposals.map(
    (p) =>
      p &&
      items.push({
        id: p.id,
        group: selectGroup(p.type),
        start_time: moment(startTime + p.createdAt * 6000).valueOf(),
        end_time: p.finalizedAt
          ? moment(startTime + p.finalizedAt * 6000).valueOf()
          : moment().valueOf(),
        title: p.title,
      })
  );

  const first = items.sort((a, b) => a.end_time - b.end_time)[0];

  return (
    <div>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment(first.start_time).add(-1, "day")}
        defaultTimeEnd={moment().add(15, "day")}
      />
      <Back />
    </div>
  );
};

export default Calendar;
