import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const mintTags = [``, ``, `Storage`, `Content`, `Operations`];
const mJoy = (joy: number) => (joy ? (joy / 1000000).toFixed(3) : ``);

const Groups = (props: { workers: {}; mints: number[] }) => {
  const { mints, workers } = props;
  if (!mints?.length) return <div />;
  return (
    <div className="mt-3">
      <h2 className="m-3 text-center">Working Groups</h2>
      <div className="d-flex flex-wrap">
        <Group workers={workers?.storage} mint={mints[2]} tag={mintTags[2]} />
        <Group workers={workers?.content} mint={mints[3]} tag={mintTags[3]} />
        <Group
          workers={workers?.operations}
          mint={mints[4]}
          tag={mintTags[4]}
        />
      </div>
    </div>
  );
};

const Group = (props: { workers: any[]; mint: {}; tag: string }) => {
  const { workers, mint, tag } = props;
  if (!workers)
    return (
      <div className=" p-3 col-lg-4">
        <h3 className="m-3 text-center">{tag}</h3>
        <div className="text-center">
          <b>Mint:</b> {formatMint(mint)}
        </div>
        <Loading target="workers" />
      </div>
    );

  const rewards = workers.reduce(
    (sum, { reward }) => sum + (reward?.amount_per_payout || 0),
    0
  );
  const stakes = workers.reduce((sum, { stake }) => sum + (stake || 0), 0);

  return (
    <div className="p-3 col-lg-4">
      <h2 className="m-3 text-center">
        {tag} <Mint mint={mint} />
      </h2>

      <Table>
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
            <td>{mJoy(rewards * 28)}</td>
            <td>{mJoy(mint.total_minted)}</td>
            <td>{mJoy(stakes)}</td>
          </tr>

          {workers.map((w) => (
            <tr key={w.id}>
              <td>{w.id}</td>
              <td>
                <Link className="text-dark" to={`/members/${w.handle}`}>
                  {w.handle}
                </Link>
              </td>
              <td>{mJoy(w.reward?.amount_per_payout * 28)}</td>
              <td>{mJoy(w.reward?.total_reward_received)}</td>
              <td>{mJoy(w.stake)}</td>
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
  const { capacity, total_minted } = mint;
  const current = (capacity / 1000000).toFixed(1);
  const total = (total_minted / 1000000).toFixed(1);
  const color = current < 1 ? `danger` : current < 2 ? `warning` : `success`;
  return (
    <Button className="p-1" variant={color} title="Mint Capacity">
      {current} M
    </Button>
  );
};

export default Groups;
