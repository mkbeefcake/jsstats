import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const mJoy = (joy: number) => (joy ? (joy / 1000000).toFixed(3) : ``);

const Groups = (props: { price: nubmer; workers: {}; mints: number[] }) => {
  const { mints, workers, price } = props;
  if (!workers) return <Loading target="workers" />;
  const groups = Object.keys(workers).filter((k) => workers[k]?.length);
  if (!groups.length) return <Loading target="workers" />;
  return (
    <div className="d-flex flex-wrap">
      {groups.map((group) => (
        <Group
          key={group}
          group={group}
          workers={workers[group]}
          mint={mints.find((m) => m?.group === group)}
          price={price}
        />
      ))}
    </div>
  );
};

const Head = (props: { group: string; mint: any }) => {
  const { group, mint } = props;
  return (
    <h2 className="m-3 text-center">
      {group} <Mint mint={mint?.content} />
    </h2>
  );
};

const Group = (props: {
  group: string;
  price: number;
  workers: any[];
  mint: {};
}) => {
  const { group, workers, mint, price } = props;
  if (!group) return <div />;
  if (!workers)
    return (
      <div className="p-12 col-lg-6">
        <Head group={group} mint={mint} />
        <Loading target="workers" />
      </div>
    );
  if (!workers.length) return <div />;

  const rewards = workers.reduce(
    (sum, { reward }) => sum + (reward?.amount_per_payout || 0),
    0
  );
  const stakes = workers.reduce((sum, { stake }) => sum + (stake || 0), 0);

  const td = (joy: number) => (
    <td title={`$` + (joy * price).toFixed(2)}>{mJoy(joy)}</td>
  );

  return (
    <div className="p-12 col-lg-6">
      <Head group={group} mint={mint} />
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
            {td(mint?.content?.total_minted)}
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
  if (!props.mint) return <div />;
  const { capacity } = props.mint;
  const current = (capacity / 1000000).toFixed(1);
  const color = current < 1 ? `danger` : current < 2 ? `warning` : `success`;
  return (
    <Button className="p-1" variant={color} title="Mint Capacity">
      {current} M
    </Button>
  );
};

export default Groups;
