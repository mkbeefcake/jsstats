import GroupOpening from "./Opening";
import { Member, Opening } from "./types";

const GroupOpenings = (props: {
  members: Member[];
  group: string;
  openings: Opening[];
}) => {
  const { members, group, openings } = props;
  if (!openings?.length) return <div />;
  return (
    <div className="p-3">
      <h2>{group}</h2>
      {openings.map((opening) => (
        <GroupOpening
          key={opening.openingId}
          members={members}
          group={group}
          opening={opening}
        />
      ))}
    </div>
  );
};

export default GroupOpenings;
