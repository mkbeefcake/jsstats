import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import MemberOverlay from "../Members/MemberOverlay";
import Bar from "./Bar";
import Posts from "./Posts";
import Detail from "./Detail";
import { VoteNowButton, VotesTooltip, VotesBubbles } from "..";
import moment from "moment";

import {
  Member,
  Post,
  ProposalDetail,
  ProposalPost,
  Seat,
  Vote,
} from "../../types";
import { ProposalParameters, VotingResults } from "@joystream/types/proposals";

const formatTime = (time: number) => {
  return moment(time).format("DD/MM/YYYY HH:mm");
};

const colors: { [key: string]: string } = {
  Approved: "success",
  Rejected: "danger ",
  Canceled: "danger ",
  Expired: "warning ",
  Pending: "",
};

const ProposalRow = (props: {
  block: number;
  createdAt: number;
  finalizedAt: number;
  startTime: number;
  description: string;
  author: string;
  id: number;
  parameters: ProposalParameters;
  exec: boolean;
  result: string;
  stage: string;
  title: string;
  type: string;
  votes: VotingResults;
  members: Member[];
  posts: ProposalPost[];
  votesByAccount?: Vote[];
  detail?: any;
  // author overlay
  councils: Seat[][];
  forumPosts: Post[];
  proposals: ProposalDetail[];
  validators: string[];
}) => {
  const {
    block,
    createdAt,
    description,
    finalizedAt,
    author,
    id,
    title,
    type,
    votes,
    detail,
    members,
  } = props;

  const url = `https://pioneer.joystreamstats.live/#/proposals/${id}`;
  let result: string = props.result ? props.result : props.stage;
  if (props.exec) result = "Executing";
  const color = colors[result];

  const created = formatTime(props.startTime + createdAt * 6000);
  const finalized =
    finalizedAt && formatTime(props.startTime + finalizedAt * 6000);

  const period = +props.parameters.votingPeriod;

  let blocks = finalizedAt ? finalizedAt - createdAt : block - createdAt;
  const days = blocks ? Math.floor(blocks / 14400) : 0;
  const hours = blocks ? Math.floor((blocks - days * 14400) / 600) : 0;
  const daysStr = days ? `${days}d` : "";
  const hoursStr = hours ? `${hours}h` : "";
  const duration = blocks ? `${daysStr} ${hoursStr} / ${blocks} blocks` : "";

  return (
    <div className="d-flex flex-row justify-content-between text-left p-2">
      <div className="col-3">
        <OverlayTrigger
          key={id}
          placement="right"
          overlay={<Tooltip id={String(id)}>{description}</Tooltip>}
        >
          <b>
            <Link to={`/proposals/${id}`}>{title}</Link>
          </b>
        </OverlayTrigger>
        <div>
          <Posts posts={props.posts} />
        </div>

        <OverlayTrigger
          placement={"right"}
          overlay={
            <Tooltip id={`overlay-${author}`} className="member-tooltip">
              <MemberOverlay
                handle={author}
                members={members}
                councils={props.councils}
                proposals={props.proposals}
                posts={props.forumPosts}
                startTime={props.startTime}
                validators={props.validators}
              />
            </Tooltip>
          }
        >
          <div>
            by
            <Link to={`/members/${author}`}> {author}</Link>
          </div>
        </OverlayTrigger>
      </div>
      <div className="col-2 text-left">
        <Detail detail={detail} type={type} />
      </div>

      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip id={`votes-${id}`}>
            <VotesTooltip votesByAccount={props.votesByAccount} votes={votes} />
          </Tooltip>
        }
      >
        <div className={`col-1 p-2 border border-${color}`}>
          <b>{result}</b>
          <div className="d-flex flex-row">
            <VotesBubbles votes={votes} />
          </div>
        </div>
      </OverlayTrigger>

      <div className="col-2 text-left">
        <Bar id={id} blocks={blocks} period={period} duration={duration} />
      </div>

      <div className="col-1">{created}</div>
      <div className="col-1">
        {finalized ? finalized : <VoteNowButton show={true} url={url} />}
      </div>
    </div>
  );
};

export default ProposalRow;
