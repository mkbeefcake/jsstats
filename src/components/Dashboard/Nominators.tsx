import React from "react";
import User from "../User";
import { Handles } from "../../types";

const Nominators = (props: { nominators: string[] ,handles:Handles}) => {
  const { nominators,handles } = props;
  //if (!nominators) return ""
  
  const half = Math.floor(nominators.length / 2) + 1;

  return (
    <div className="box">
      <h3>Nominators</h3>
      <div className="d-flex flex-row">
        <div className="mx-1">
          {nominators.slice(0, half).map((nominator: string) => (
            <User key={nominator} id={nominator} handle={handles[nominator]} />
          ))}
        </div>
        <div className="mx-1">
          {nominators.slice(half).map((nominator: string) => (
            <User key={nominator} id={nominator} handle={handles[nominator]}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nominators;
