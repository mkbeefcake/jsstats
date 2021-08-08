import React from "react";
import { Badge } from "react-bootstrap";
import MemberOverlay from "../Members/MemberOverlay";
import Bar from "./Bar";
import Posts from "./Posts";
import Detail from "./Detail";
import { VoteNowButton, VotesBubbles } from "..";
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
  } = props;

  const url = `https://pioneer.joystreamstats.live/#/proposals/${id}`;
  let result: string = props.result ? props.result : props.stage;
  if (executed) result = Object.keys(props.executed)[0];

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
    <div className="box d-flex flex-column">
      <div className="d-flex flex-row justify-content-left text-left mt-3">
        <div className="col-5 col-md-3 text-left">
          <InfoTooltip
            placement="bottom"
            id={`overlay-${author}`}
            title={
              <MemberOverlay
                handle={author.handle}
                member={author}
                councils={props.councils}
                proposals={props.proposals}
                posts={props.forumPosts}
                startTime={props.startTime}
                validators={props.validators}
              />
            }
          >
            <div>
              <Link className={classes.link} href={`/members/${author.handle}`}>
                {author.handle}
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

        <Badge className={`bg-${colors[result]} col-2 p-3 d-md-block ml-auto`}>
          <div className={`bg-${colors[result]} mb-2`}>
            <b>{result}</b>
          </div>

          {finalized ? finalized : <VoteNowButton show={true} url={url} />}
        </Badge>
      </div>
      <div className="d-flex flex-row p-2">
        <VotesBubbles votes={votes} />
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
