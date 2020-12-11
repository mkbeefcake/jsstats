import React from "react";
import User from "../User";
import { Handles } from "../../types";
import Loading from "../Loading";

const Validators = (props: { validators: string[]; handles: Handles }) => {
  const { validators, handles } = props;

  const third = Math.floor(validators.length / 3) + 1;

  return (
    <div className="box">
      <h3>Validators</h3>

      {(validators.length && (
        <div className="d-flex flex-row">
          <div className="mx-1">
            {validators.slice(0, third).map((validator: string) => (
              <User
                key={validator}
                id={validator}
                handle={handles[validator]}
              />
            ))}
          </div>
          <div className="mx-1">
            {validators.slice(third, third * 2).map((validator: string) => (
              <User
                key={validator}
                id={validator}
                handle={handles[validator]}
              />
            ))}
          </div>
          <div className="mx-1">
            {validators.slice(third * 2).map((validator: string) => (
              <User
                key={validator}
                id={validator}
                handle={handles[validator]}
              />
            ))}
          </div>
        </div>
      )) || <Loading />}
    </div>
  );
};

export default Validators;
