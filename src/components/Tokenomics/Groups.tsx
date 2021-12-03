import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const mintTags = [``, ``, `Storage`, `Content`, `Operations`];
const mJoy = (joy: number) => (joy ? (joy / 1000000).toFixed(3) : ``);
const formatMint = (mint: { capacity: number; total_minted: number }) => {
  if (!mint) return `loading ..`;
  const { capacity, total_minted } = mint;
  const current = (capacity / 1000000).toFixed(1);
  const total = (total_minted / 1000000).toFixed(1);
  return `${current} M of ${total} M tJOY`;
};

const Mints = (props: { mints: number[] }) => {
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
    <div className=" p-3 col-lg-4">
      <h3 className="m-3 text-center">{tag}</h3>
      <div className="text-center">
        <b>Mint:</b> {formatMint(mint)}
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Member</th>
            <th>Term Reward [MJOY]</th>
            <th>Stake [MJOY]</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <b>Total</b>
            </td>
            <td>{mJoy(rewards * 28)}</td>
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
              <td>{mJoy(w.stake)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Mints;
