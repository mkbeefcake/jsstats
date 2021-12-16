import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const mintTags = [``, ``, `Storage`, `Content`, `Operations`];
const mJoy = (joy: number) => (joy ? (joy / 1000000).toFixed(3) : ``);

const Groups = (props: { price: nubmer; workers: {}; mints: number[] }) => {
  const { mints, workers, price } = props;
  if (!mints[4]) return <div />;
  return (
    <div className="d-flex flex-wrap">
      <Group
        workers={workers?.storage}
        mint={mints[2]}
        tag={mintTags[2]}
        price={price}
      />
      <Group
        workers={workers?.content}
        mint={mints[3]}
        tag={mintTags[3]}
        price={price}
      />
      <Group
        workers={workers?.operations}
        mint={mints[4]}
        tag={mintTags[4]}
        price={price}
      />
    </div>
  );
};

const Group = (props: {
  price: number;
  workers: any[];
  mint: {};
  tag: string;
}) => {
  const { workers, mint, tag, price } = props;
  if (!workers)
    return (
      <div className="p-3 col-lg-4">
        <h2 className="m-3 text-center">
          {tag} <Mint mint={mint} />
        </h2>
        <Loading target="workers" />
      </div>
    );

  const rewards = workers.reduce(
    (sum, { reward }) => sum + (reward?.amount_per_payout || 0),
    0
  );
  const stakes = workers.reduce((sum, { stake }) => sum + (stake || 0), 0);

  const td = (joy: number) => (
    <td title={`$` + (joy * price).toFixed(2)}>{mJoy(joy)}</td>
  );

  return (
    <div className="p-3 col-lg-4">
      <h2 className="m-3 text-center">
        {tag} <Mint mint={mint} />
      </h2>

      <Table className="text-light">
        <thead>
          <tr>
            <th>ID</th>
            <th>Member</th>
            <th colSpan={2}>Reward Term / Total [MJOY]</th>
            <th>Stake [MJOY]</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-weight-bold">
            <td></td>
            <td>Total</td>
            {td(rewards * 28)}
            {td(mint.total_minted)}
            {td(stakes)}
          </tr>

          {workers.map((w) => (
            <tr key={w.id}>
              <td>{w.id}</td>
              <td>
                <Link className="text-warning" to={`/members/${w.handle}`}>
                  {w.handle}
                </Link>
              </td>
              {td(w.reward?.amount_per_payout * 28)}
              {td(w.reward?.total_reward_received)}
              {td(w.stake)}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const Mint = (props: { mint: { capacity: number; total_minted: number } }) => {
  const { mint } = props;
  if (!mint) return <div />;
  const current = (mint.capacity / 1000000).toFixed(1);
  const color = current < 1 ? `danger` : current < 2 ? `warning` : `success`;
  return (
    <Button className="p-1" variant={color} title="Mint Capacity">
      {current} M
    </Button>
  );
};

export default Groups;
