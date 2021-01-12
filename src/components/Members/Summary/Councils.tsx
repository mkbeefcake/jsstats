import React from "react";
import { Link } from "react-router-dom";

const Councils = (props: { onCouncil: number; votes: number }) => {
  const { onCouncil, votes } = props;
  if (!onCouncil) return <span />;

  const councils = onCouncil > 1 ? `${onCouncil} times` : "once";
  const voted = votes > 1 ? `${votes} proposals` : "one proposal";

  return (
    <div>
      <div>
        Council member: <Link to={`/councils`}>{councils}</Link>
      </div>
      <div>
        Voted on <Link to={`/councils`}>{voted}</Link>.
      </div>
    </div>
  );
};

export default Councils;
