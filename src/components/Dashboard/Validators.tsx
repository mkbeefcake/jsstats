import React from "react";
import User from "../User";

const Validators = (props: { validators: string[] }) => {
  const { validators } = props;
  const third = Math.floor(validators.length / 3) + 1;

  return (
    <div className="box">
      <h3>Validators</h3>
      <div className="d-flex flex-row">
        <div className="mx-1">
          {validators.slice(0, third).map((validator: string) => (
            <User key={validator} id={validator} />
          ))}
        </div>
        <div className="mx-1">
          {validators.slice(third, third * 2).map((validator: string) => (
            <User key={validator} id={validator} />
          ))}
        </div>
        <div className="mx-1">
          {validators.slice(third * 2).map((validator: string) => (
            <User key={validator} id={validator} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Validators;
