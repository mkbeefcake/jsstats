import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Stakes } from "../../types";
import Loading from "../Loading";

const dollar = (d: number) => (d > 0 ? `$ ${d.toFixed(2)}` : "");

const MinMax = (props: {
  stakes?: { [key: string]: Stakes };
  block: number;
  era: number;
  issued: number;
  validators: string[];
  nominators: number;
  waiting: number;
  reward: number;
  price: number;
}) => {
  const { issued, stakes, validators, waiting, reward, price } = props;
  if (!stakes || !Object.values(stakes).length) return <Loading target={"stakes"} />

  let sum = 0;
  let minStake: number = 10000000;
  let maxStake: number = 0;
  Object.keys(stakes).forEach((v: string) => {
    if (!validators.includes(v)) return;
    const { total } = stakes[v];
    if (total > 0) sum += total;
    else return;

    if (total > maxStake) maxStake = total;
    if (total < minStake) minStake = total;
  });

  const name = { className: "text-right" };
  const value = { className: "text-left" };
  const validatorReward = reward ? reward / validators.length : 0;

  return (
    <Table className="text-center" style={{ color: "#fff" }}>
      <tbody>
        <tr>
          <td {...name}>Validators</td>
          <td {...value}>{validators.length}</td>
        </tr>
        <tr>
          <td {...name}>Waiting</td>
          <td {...value}>{waiting}</td>
        </tr>
        <tr>
          <td {...name}>Nominators</td>
          <td {...value}>{props.nominators}</td>
        </tr>

        <tr>
          <td {...name}>Issued</td>
          <td {...value}> {(issued / 1000000).toFixed(1)} M JOY</td>
        </tr>
        <tr>
          <td {...name}>Staked</td>
          <td {...value}>
            {(sum / 1000000).toFixed(1)} M JOY (
            <b>{issued ? ((sum / issued) * 100).toFixed(1) : `-`}%</b>)
          </td>
        </tr>
        <tr>
          <td {...name}>Min stake</td>
          <td {...value}>{minStake} JOY</td>
        </tr>
        <tr>
          <td {...name}>Max stake</td>
          <td {...value}>{maxStake} JOY </td>
        </tr>
        <tr>
          <td {...name}>Total paid per hour</td>
          <td {...value}>
            {reward ? `${reward} JOY (${dollar(price * reward)})` : "Loading.."}
          </td>
        </tr>
        <tr>
          <td {...name}>Reward per validator per hour</td>
          <td className="text-left text-warning">
            <ValidatorReward
              show={reward}
              price={price}
              reward={validatorReward}
            />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
export default MinMax;

const ValidatorReward = (props) => {
  const { show, price, reward } = props;
  if (!show) return `Loading..`;
  return (
    <>
      {reward.toFixed(0)} JOY ({dollar(price * reward)})
      <Link className="ml-1" to={"/mint"}>
        Details
      </Link>
    </>
  );
};
