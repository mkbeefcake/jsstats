import React from "react";
import { Link } from "react-router-dom";
import { Badge, ListGroup } from "react-bootstrap";
import moment from "moment"

const Proposals = (props: {
  proposals: ProposalDetail[];
  startTime: number;
}) => {
  const { proposals, startTime } = props;

  if (!proposals.length) return <div />;

  return (
    <div className="mt-3">
      <h3 className="text-center text-light">Latest Proposals</h3>
      <ListGroup className="box">
        {proposals
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
          .map((p) => (
            <ListGroup.Item key={p.id} className="box bg-secondary">
              <Link to={`/proposals/${p.id}`}>
                <Badge
                  className="mr-2"
                  variant={
                    p.result === "Approved"
                      ? "success"
                      : p.result === "Pending"
                      ? "warning"
                      : "danger"
                  }
                >
                  {p.result}
                </Badge>
                {p.title}, {moment(startTime + p.createdAt * 6000).fromNow()}
              </Link>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default Proposals