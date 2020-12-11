import React from "react";
import User from "../User";
import { Handles } from "../../types";
import Loading from "../Loading";

const Nominators = (props: { nominators: string[]; handles: Handles }) => {
  const { nominators, handles } = props;

  const half = Math.floor(nominators.length / 2) + 1;

  return (
    <div className="box">
      <h3>Nominators</h3>

      {(nominators.length && (
        <div className="d-flex flex-row">
          <div className="mx-1">
            {nominators.slice(0, half).map((nominator: string) => (
              <User
                key={nominator}
                id={nominator}
                handle={handles[nominator]}
              />
            ))}
          </div>
          <div className="mx-1">
            {nominators.slice(half).map((nominator: string) => (
              <User
                key={nominator}
                id={nominator}
                handle={handles[nominator]}
              />
            ))}
          </div>
        </div>
      )) || <Loading />}
    </div>
  );
};

export default Nominators;
