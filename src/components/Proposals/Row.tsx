import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "react-bootstrap";
import { makeStyles } from "@material-ui/core";
import moment from "moment";

import { InfoTooltip, MemberOverlay, VoteNowButton, VotesBubbles } from "..";
import Bar from "./Bar";
import Posts from "./Posts";
import Detail from "./Detail";
import { formatDate } from "../../lib/util";
import { domain } from "../../config";
import { ProposalParameters, VotingResults } from "@joystream/types/proposals";
import {
  Council,
  Member,
  Post,
  ProposalDetail,
  ProposalPost,
  Vote,
} from "../../types";

const colors: { [key: string]: string } = {
  Approved: "success",
  Rejected: "danger ",
  Canceled: "danger ",
  Expired: "warning ",
  Pending: "secondary",
};

const useStyles = makeStyles({
  link: {
    color: "#000",
    "&:hover": {
      color: "#fff",
    },
  },
});

const ProposalRow = (props: {
  block: number;
  createdAt: number;
  finalizedAt: number;
  startTime: number;
  description: string;
  domain: string;
  author: string;
  id: number;
  parameters: ProposalParameters;
  executed?: any;
  result: string;
  stage: string;
  title: string;
  type: string;
  votes: VotingResults;
  members: Member[];
  votesByAccount?: Vote[];
  detail?: any;
  // author overlay
  councils: Council[];
  council: Council;
  posts: Post[];
  proposals: ProposalDetail[];
  proposalPosts?: ProposalPost[];
  validators: string[];
}) => {
  const {
    block,
    council,
    councils,
    createdAt,
    description,
    executed,
    finalizedAt,
    author,
    id,
    title,
    type,
    posts,
    proposals,
    proposalPosts,
    votes,
    detail,
    startTime,
    validators,
  } = props;

  let result: string = props.result ? props.result : props.stage;
  if (executed) result = Object.keys(props.executed)[0];

  const finalized = finalizedAt && formatDate(startTime + finalizedAt * 6000);

  const period = +props.parameters.votingPeriod;
  let blocks = finalizedAt ? finalizedAt - createdAt : block - createdAt;
  const percent = (100 - 100 * (blocks / period)).toFixed();

  const moments = (blocks: number) => moment().add(blocks).fromNow();
  const expires = moments(6000 * (period - blocks));
  const age = moments(-blocks * 6000);
  const time = formatDate(startTime + createdAt * 6000);
  const created = blocks ? `${age} at ${time}` : time;
  const left = `${period - blocks} / ${period} blocks left (${percent}%)`;
  const classes = useStyles();

  const hasToVote = council?.consuls?.filter(
    (c) => !votes.find((v) => v.member?.handle === c.member?.handle)
  );

  return (
    <div className="box d-flex flex-column">
      <div className="d-flex flex-row justify-content-left text-left mt-3">
        <Badge className={`bg-${colors[result]} col-2 d-md-block`}>
          <div className={`-${colors[result]} my-2`}>
            <b>{result}</b>
          </div>
          {finalized ? (
            finalized
          ) : (
            <div>
              <VoteNowButton show={true} url={`${domain}/#/proposals/${id}`} />
            </div>
          )}
        </Badge>

        <div className="col-5 text-left">
          <InfoTooltip
            placement="bottom"
            id={`overlay-${author}`}
            title={
              <MemberOverlay
                handle={author.handle}
                member={author}
                councils={councils}
                proposals={proposals}
                posts={posts}
                startTime={startTime}
                validators={validators}
              />
            }
          >
            <div>
              <Link className={classes.link} to={`/members/${author.handle}`}>
                {author.handle}
              </Link>
            </div>
          </InfoTooltip>
          <InfoTooltip placement="bottom" key={id} title={description}>
            <b>
              <Link className={classes.link} to={`/proposals/${id}`}>
                {title}
              </Link>
              <Posts posts={proposalPosts} />
            </b>
          </InfoTooltip>
          <Detail detail={detail} type={type} />
        </div>
      </div>

      <div className="d-flex flex-wrap p-2">
        <VotesBubbles votes={votes} />

        {hasToVote?.map((c) => (
          <Button
            key={c.id}
            variant="outline-secondary"
            className="btn-sm p-1"
            title={`${c.member.handle} did not vote.`}
          >
            {c.member.handle}
          </Button>
        ))}
      </div>

      <Bar
        id={id}
        blocks={blocks}
        created={created}
        expires={expires}
        left={left}
        percent={percent}
      />
    </div>
  );
};

export default ProposalRow;
