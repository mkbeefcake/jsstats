import React from "react";
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
import InfoTooltip from "../Tooltip";
import { Link, makeStyles } from "@material-ui/core";

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
    executed,
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
  if (executed) result = Object.keys(props.executed)[0];
  const color = colors[result];

  const finalized =
    finalizedAt && formatTime(props.startTime + finalizedAt * 6000);

  const period = +props.parameters.votingPeriod;
  let blocks = finalizedAt ? finalizedAt - createdAt : block - createdAt;
  const percent = (100 - 100 * (blocks / period)).toFixed();

  const moments = (blocks: number) => moment().add(blocks).fromNow();
  const expires = moments(6000 * (period - blocks));
  const age = moments(-blocks * 6000);
  const time = formatTime(props.startTime + createdAt * 6000);
  const created = blocks ? `${age} at ${time}` : time;
  const left = `${period - blocks} / ${period} blocks left (${percent}%)`;
  const classes = useStyles();
  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-wrap justify-content-left text-left mt-3">
        <InfoTooltip
          placement="right"
          id={`votes-${id}`}
          title={
            <VotesTooltip votesByAccount={props.votesByAccount} votes={votes} />
          }
        >
          <div
            style={{ borderRadius: "4px" }}
            className={`col-3 col-md-1 text-center p-2 border border-${color}`}
          >
            <b>{result}</b>
            <div className="d-flex flex-row justify-content-center">
              <VotesBubbles votes={votes} />
            </div>
          </div>
        </InfoTooltip>

        <div className="col-9 col-md-3 text-left">
          <InfoTooltip
            placement="bottom"
            id={`overlay-${author}`}
            title={
              <MemberOverlay
                handle={author}
                members={members}
                councils={props.councils}
                proposals={props.proposals}
                posts={props.forumPosts}
                startTime={props.startTime}
                validators={props.validators}
              />
            }
          >
            <div>
              <Link className={classes.link} href={`/members/${author}`}>
                {" "}
                {author}
              </Link>
            </div>
          </InfoTooltip>
          <InfoTooltip placement="bottom" key={id} title={description}>
            <b>
              <Link className={classes.link} href={`/proposals/${id}`}>
                {title}
              </Link>
              <Posts posts={props.posts} />
            </b>
          </InfoTooltip>
          <Detail detail={detail} type={type} />
        </div>

        <div className="d-none d-md-block ml-auto">
          {finalized ? finalized : <VoteNowButton show={true} url={url} />}
        </div>
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
