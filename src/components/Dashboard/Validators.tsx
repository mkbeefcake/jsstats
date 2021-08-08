import React from "react";
import User from "../User";
import { Handles } from "../../types";
import Loading from "../Loading";

const Validators = (props: {
  validators: string[];
  members: { rootKey: string }[];
}) => {
  const { getMember, validators } = props;

  const third = Math.floor(validators.length / 3) + 1;

  return (
    <div className="box col md-5 sm-10">
      <h3>Validators</h3>

      {(validators.length && (
        <div className="d-flex flex-row">
          <div className="col">
            {validators.slice(0, third).map((validator: string) => (
              <User
                key={validator}
                id={validator}
                handle={getMember(validator)?.handle || validator}
              />
            ))}
          </div>
          <div className="col">
            {validators.slice(third, third * 2).map((validator: string) => (
              <User
                key={validator}
                id={validator}
                handle={getMember(validator)?.handle || validator}
              />
            ))}
          </div>
          <div className="col">
            {validators.slice(third * 2).map((validator: string) => (
              <User
                key={validator}
                id={validator}
                handle={getMember(validator)?.handle || validator}
              />
            ))}
          </div>
        </div>
      )) || <Loading target="Validators" />}
    </div>
  );
};

export default Validators;
