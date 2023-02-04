import { mJoy, fixGroupName } from "../../../lib/util";

const Groups = (props: {}) => {
  const { events } = props;

  let groups = {};
  events.forEach((e) => {
    const group = fixGroupName(e.groupId);
    const handle = e.worker.membership.handle;
    if (!groups[group]) groups[group] = { total: 0 };
    if (!groups[group][handle]) groups[group][handle] = 0;
    groups[group][handle] += +e.amount;
    groups[group].total += +e.amount;
  });

  return (
    <div className="d-flex flex-wrap">
      {Object.keys(groups).map((group, i) => (
        <div key={i} className="col-3 col-md-6  mb-3">
          <h4 className="text-center">{group}</h4>

          {Object.keys(groups[group])
            .sort((a, b) => groups[group][b] - groups[group][a])
            .map((handle) => (
              <div
                key={`salary-${group}-${handle}`}
                className="d-flex flex-row"
              >
                <div className="col-3">{handle}</div>
                <div className="col-8 text-right">
                  {mJoy(groups[group][handle])}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Groups;
