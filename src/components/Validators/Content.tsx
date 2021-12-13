import Leaderboard from "./Leaderboard";
import Stakes from "./Stakes";
import Stats from "./MinMax";
import ValidatorList from "./ValidatorList";
import { Spinner } from "..";

const Content = (props: IState) => {
  const { validators, stashes, stars, status, stakes, tokenomics } = props;
  if (!status?.block || !validators.length) return <Spinner />;

  const { block, era } = status;
  const waiting = stashes.filter((s) => !stars[s] && !validators.includes(s));
  const issued = tokenomics ? Number(tokenomics.totalIssuance) : 0;
  const price = tokenomics ? Number(tokenomics.price) : 0;

  return (
    <div className="p-3">
      <Stats
        block={block}
        era={era}
        stakes={stakes}
        issued={issued}
        price={price}
        validators={validators}
        nominators={props.nominators.length}
        waiting={waiting.length}
        reward={status.lastReward}
      />
      <Leaderboard members={props.members} points={props.rewardPoints} />
      <Stakes stakes={props.stakes} members={props.members} />
      <ValidatorList
        toggleStar={props.toggleStar}
        waiting={waiting}
        {...props}
      />
    </div>
  );
};

export default Content;
