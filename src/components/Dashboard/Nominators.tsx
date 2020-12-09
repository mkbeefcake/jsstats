import React from "react";
import User from "../User";

const Nominators = (props: { nominators: string[] }) => {
  const { nominators } = props;
  const half = Math.floor(nominators.length / 2) + 1;

  return (
    <div className="box">
      <h3>Nominators</h3>
      <div className="d-flex flex-row">
        <div className="mx-1">
          {nominators.slice(0, half).map((nominator: string) => (
            <User key={nominator} id={nominator} />
          ))}
        </div>
        <div className="mx-1">
          {nominators.slice(half).map((nominator: string) => (
            <User key={nominator} id={nominator} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nominators;
