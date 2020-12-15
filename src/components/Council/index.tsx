import React from "react";
import { Link } from "react-router-dom";
import ElectionStatus from "./ElectionStatus";
import User from "../User";
import { Seat } from "../../types";
import Loading from "../Loading";

const Council = (props: {
  council: Seat[];
  handles: { [key: string]: string };
  councilElection?: any;
  block: number;
}) => {
  const { council, handles, block, councilElection } = props;
  const half = Math.floor(council.length / 2);

  return (
    <div className="box">
      <ElectionStatus block={block} councilElection={councilElection} />
      <h3>Council</h3>

      {(council.length && (
        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            {council.slice(0, half).map((seat: Seat) => (
              <div key={String(seat.member)} className="col">
                <User id={String(seat.member)} handle={handles[seat.member]} />
              </div>
            ))}
          </div>
          <div className="d-flex flex-row">
            {council.slice(half).map((seat: Seat) => (
              <div key={String(seat.member)} className="col">
                <User id={String(seat.member)} handle={handles[seat.member]} />
              </div>
            ))}
          </div>
        </div>
      )) || <Loading />}
      <hr />
      <Link to={`/tokenomics`}>Reports</Link>
    </div>
  );
};

export default Council;
