import GroupOpening from "./Opening";

import { Opening } from "./types";

const GroupOpenings = (props: { group: string; openings: Opening[] }) => {
  const { group, openings } = props;
  if (!openings?.length) return <div />;
  return (
    <div className="p-3">
      <h2>{group}</h2>
      {openings.map((opening) => (
        <GroupOpening key={opening.id} group={group} opening={opening} />
      ))}
    </div>
  );
};

export default GroupOpenings;
