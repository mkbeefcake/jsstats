import React from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { ChevronLeft, ChevronRight } from "react-feather";

//import Navigation from "./Navigation";
import { VotesTooltip } from "..";
import { ProposalDetail } from "../../types";
import { domain } from "../../config";

const Navigation = (props: { id: number; proposals: number }) => {
  const { id, proposals } = props;

  return (
    <span>
      {id > 1 ? (
        <Link to={`/proposals/${id - 1}`}>
          <ChevronLeft fill="white" stroke="white" />
        </Link>
      ) : (
        <ChevronLeft />
      )}
      {proposals > id + 1 ? (
        <Link to={`/proposals/${id + 1}`}>
          <ChevronRight fill="white" stroke="white" />
        </Link>
      ) : (
        <ChevronRight />
      )}
    </span>
  );
};

const Proposal = (props: {
  match: { params: { id: string } };
  proposals: ProposalDetail[];
}) => {
  const { match, proposals } = props;
  const id = parseInt(match.params.id);
  const proposal = proposals.find((p) => p && p.id === id);
  if (!proposal)
    return (
      <Link to={`/proposals/${proposals.length}`}>
        Proposal {proposals.length}
      </Link>
    );
  const {
    author,
    description,
    title,
    message,
    result,
    stage,
    votes,
  } = proposal;
  return (
    <div>
      <div className="text-center p-1 m-1">
        <Navigation id={id} proposals={proposals.length} />
      </div>
      <div className="d-flex flex-row">
        <div className="box col-6 ml-3">
          <h3>{title}</h3>

          <Markdown
            plugins={[gfm]}
            className="mt-1 overflow-auto text-left"
            children={description}
          />
        </div>
        <div className="col-lg-3 d-flex flex-column">
          <div className="box text-left">
            <div>
              Title: <a href={`${domain}/#/proposals/${id}`}>{title}</a>
            </div>
            <div>
              Author:{" "}
              <Link to={`/members/${author.handle}`}>{author.handle}</Link>
            </div>
            <div>Stage: {stage}</div>
            <div>Result: {result}</div>
          </div>

          <div className="box">
            <h3>Votes</h3>
            <VotesTooltip votes={votes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposal;
