import { ErasRewardPoints } from "../../types";
import Eras from "./Eras";
import Validator from "./Validator";
import { maxEras, maxValidators } from "./config";

const getSums = (points: ErasRewardPoints) => {
  let sums = [];
  Object.keys(points.validators).forEach((validator: string) => {
    const erasObj = points.validators[validator];
    if (!erasObj) return;
    let sum = 0;
    Object.keys(erasObj).forEach((era: number) => (sum += erasObj[era]));
    sums.push({ validator, sum });
  });
  return sums.sort((a, b) => b.sum - a.sum).slice(0, maxValidators);
};

const formatPoints = (points: number): string =>
  points > 1000000
    ? (points / 1000000).toFixed(1) + "M"
    : points > 1000
    ? (points / 1000).toFixed(2) + "K"
    : points;

const Leaderboard = (props: { points: ErasRewardPoints }) => {
  const { members, points } = props;
  if (!points?.total) return <div />;
  const count = Object.keys(points.eraTotals).length;
  const title = `Sum of ${count} eras. (source: api.query.staking.erasRewardPoints)`;

  return (
    <div className="mb-3">
      <h3 className="text-center">Era Reward Points</h3>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row btn-dark p-1 overflow-hidden">
          <div className="font-weight-bold text-right">#</div>
          <div className="col-6 col-md-3 col-lg-2 font-weight-bold text-right">
            Validator
          </div>
          <div className="col-3 col-md-1 font-weight-bold text-right">
            Points
          </div>
          {Object.keys(points.eraTotals)
            .sort((a, b) => b - a)
            .slice(0, maxEras)
            .map((era) => (
              <div
                key={era}
                className="d-none d-md-block col-2 col-lg-1 font-weight-bold text-right"
              >
                {era}
              </div>
            ))}
        </div>
        <div className="d-flex flex-row py-1 bg-info overflow-hidden">
          <div className="text-right pl-1">-</div>
          <div className="col-6 col-md-3 col-lg-2 font-weight-bold text-right">
            Total
          </div>
          <div className="col-3 col-md-1 text-right" title={title}>
            {formatPoints(points.total)}
          </div>
          {Object.keys(points.eraTotals)
            .sort((a, b) => b - a)
            .slice(0, maxEras)
            .map((era) => (
              <div
                key={era}
                title={`Era ${era}`}
                className="d-none d-md-block col-2 col-lg-1 text-right"
              >
                {points.eraTotals[era]}
              </div>
            ))}
        </div>

        <div style={{ maxHeight: 500, overflowY: "auto", overflowX: "hidden" }}>
          {getSums(points).map(({ validator, sum }, index) => (
            <div key={validator} className="d-flex flex-row pr-2 py-1">
              <div className="text-right">
                {(index + 1).toString().padStart(2, "0")}
              </div>
              <Validator
                validator={validator}
                member={members.find((m) => m.rootKey === validator)}
              />
              <div className="col-3 col-md-1 text-right" title={title}>
                {formatPoints(sum)}
              </div>
              <Eras eras={points.validators[validator]} validator={validator} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
