import React from "react";
import User from "../User";
import { Seat } from "../../types";
import Loading from "../Loading";

const Council = (props: {
  council: Seat[];
  handles: { [key: string]: string };
}) => {
  const { council, handles } = props;
  const half = Math.floor(council.length / 2);

  return (
    <div className="box">
      <h3>Council</h3>

      {(council.length && (
        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            {council.slice(0, half).map((seat: Seat) => (
              <User
                key={String(seat.member)}
                id={String(seat.member)}
                handle={handles[seat.member]}
              />
            ))}
          </div>
          <div className="d-flex flex-row">
            {council.slice(half).map((seat: Seat) => (
              <User
                key={String(seat.member)}
                id={String(seat.member)}
                handle={handles[seat.member]}
              />
            ))}
          </div>
        </div>
      )) || <Loading />}
    </div>
  );
};

export default Council;
