import React from "react";
import { Link } from "react-router-dom";
import htmr from "htmr";

const Proposal = (props: any) => {
  const { match, proposals } = props;
  const id = parseInt(match.params.id);

  const proposal = proposals.find((p: any) => p && p.id === id);
  if (!proposal) return <div>Proposal not found</div>;
  const { title, message } = proposal;

  return (
    <div>
      <div className="box">
        <Link className="float-left" to="/">
          back
        </Link>
        <h3>{title}</h3>
        <div>{htmr(message.replaceAll(`\n`, "<br/>"))}</div>
        <div>
          <a href={`https://pioneer.joystreamstats.live/#/proposals/${id}`}>
            more
          </a>
        </div>
      </div>
    </div>
  );
};

export default Proposal;