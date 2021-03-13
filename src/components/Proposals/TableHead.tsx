import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const TableHead = (props: any) => {
  const { setKey, approved, proposals, avgDays, avgHours } = props;
  return (
    <div className="d-flex flex-row justify-content-between p-2 bg-dark text-light text-left font-weight-bold">
      <div className="col-3">
        <span onClick={() => setKey("description")}>Description </span>/
        <span onClick={() => setKey("author")}> Author</span>
      </div>
      <div className="col-2 text-left" onClick={() => setKey("type")}>
        Type
      </div>
      <div className="col-2 text-center">
        approved: {approved} of {proposals} (
        {Math.floor(100 * (approved / proposals))}%)
      </div>
      <div className="col-2">
        Voting Duration
        <br />∅ {avgDays ? `${avgDays}d` : ""}
        {avgHours ? `${avgHours}h` : ""}
      </div>
      <div className="col-1" onClick={() => setKey("createdAt")}>
        Created
      </div>
      <div className="col-1" onClick={() => setKey("finalizedAt")}>
        Finalized
      </div>
    </div>
  );
};
export default TableHead;
