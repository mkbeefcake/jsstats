import React from "react";
import htmr from "htmr";
import { ProposalDetail } from "../../types";
import Votes from "./VotesTooltip";
import Back from "../Back";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

const Proposal = (props: {
  match: { params: { id: string } };
  proposals: ProposalDetail[];
}) => {
  const { match, proposals } = props;
  const id = parseInt(match.params.id);

  const proposal = proposals.find((p) => p && p.id === id);
  if (!proposal) return <div>Proposal not found</div>;
  const { description, title, message, votesByAccount } = proposal;

  return (
    <div>
      <Back target="/proposals" />
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
            <div>{htmr(message.replaceAll(`\n`, "<br/>"))}</div>
            <div>
              <a href={`https://pioneer.joystreamstats.live/#/proposals/${id}`}>
                more
              </a>
            </div>
          </div>

          <div className="box">
            <h3>Votes</h3>
            <Votes votes={votesByAccount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposal;
