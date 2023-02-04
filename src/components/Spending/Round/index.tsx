import { mJoy, formatDate, sortDesc, fixGroupName } from "../../../lib/util";
import Groups from "../Groups";

const Round = (props: {}) => {
  const { round, electedAtTime, electedAtBlock, endedAtTime, endedAtBlock } =
    props;
  const [
    wgSpending,
    wgBudgetRefills,
    councilBudgetRefills,
    councilSalaryPayouts,
    workerPayments,
    councilSalaryChanges,
    openingAdded,
    openingCanceled,
    openingFilled,
    workersTerminated,
    workersExited,
    stakesSlashed,
    workerRewardUpdated,
    workerRoleUpdated,
  ] = props.data;

  const councilSalaries = councilSalaryPayouts.reduce(
    (sum, e) => sum + +e.paidBalance,
    0
  );
  const totalWgSpending = wgSpending.reduce((sum, e) => sum + +e.amount, 0);

  return (
    <div className="box text-left">
      <h1>Council #{round}</h1>
      <div>
        elected: {formatDate(electedAtTime)} ({electedAtBlock})
      </div>
      {endedAtBlock ? (
        <div>
          ended: {formatDate(endedAtTime)} ({endedAtBlock})
        </div>
      ) : (
        ""
      )}
      <div>Council salaries: {mJoy(councilSalaries)}</div>
      {councilSalaryChanges.length ? (
        <>
          <h4>Council salary changes</h4>
          <div>
            {sortDesc(councilSalaryChanges, "inBlock").map((e, i) => (
              <div key={i} className="d-flex flex-row">
                <div className="col-6" title={formatDate(e.createdAt)}>
                  {e.inBlock}
                </div>
                <div className="col-6">{mJoy(e.amount)}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        ""
      )}
      <div className="my-3 d-flex flex-wrap">
        <div className="col-3 col-md-6">
          <h2>Council Budget Refills</h2>
          <div>
            {sortDesc(councilBudgetRefills, "inBlock").map((e, i) => (
              <div key={`council-refill` + i} className="d-flex flex-row">
                <div className="col-2" title={formatDate(e.createdAt)}>
                  {e.inBlock}
                </div>
                <div className="col-8 text-right">{mJoy(e.balance)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-3 col-md-6">
          <h2>WG Budget Refills</h2>
          <div>
            {sortDesc(wgBudgetRefills, "inBlock").map((e, i) => (
              <div key={`wg-refill` + i} className="d-flex flex-row">
                <div className="col-3" title={formatDate(e.createdAt)}>
                  {e.inBlock}
                </div>
                <div className="col-2">{fixGroupName(e.group.name)}</div>
                <div className="col-7 text-right">
                  {mJoy(e.budgetChangeAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-6 col-md-12 mt-3">
          <h2>WG Spending</h2>
          Total: {mJoy(totalWgSpending)}
          <div>
            {sortDesc(wgSpending, "inBlock").map((e, i) => (
              <div key={`wg-spending` + i} className="d-flex flex-row">
                <div className="col-1" title={formatDate(e.createdAt)}>
                  {e.inBlock}
                </div>
                <div className="col-1">{fixGroupName(e.groupId)}</div>
                <div className="col-3 text-right">{mJoy(e.amount, 5)}</div>
                <div className="col-4">{e.reciever}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <h2 className="mt-3">Worker Salaries</h2>
      <Groups events={sortDesc(workerPayments, "inBlock")} />

      <div className="d-flex flex-wrap">
        <div className="col-6 col-md-12">
          <h3 className="mt-3">Worker Updates</h3>
          <div className="d-flex flex-wrap">
            <div className="col-6">
              <h4>Hires</h4>
              <div>
                {sortDesc(openingFilled, "inBlock").map((e, i) => (
                  <div key={`hire` + i} className="d-flex flex-row">
                    <div className="col-3" title={formatDate(e.createdAt)}>
                      {e.inBlock}
                    </div>
                    <div className="col-3">{fixGroupName(e.groupId)}</div>
                    <div className="col-6 d-flex flex-column">
                      {e.workersHired.map((w) => (
                        <div
                          key={`hired` + w.membership.id}
                          className="d-flex flex-row"
                          title={`member ${w.membership.id}, reward per block: ${w.rewardPerBlock}`}
                        >
                          <div className="col-10">{w.membership.handle}</div>
                          <div className="col-2">{w.rewardPerBlock}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <h4>Fires</h4>
              <div>
                {sortDesc(workersTerminated, "inBlock").map((e, i) => (
                  <div key={`fire` + i}>
                    <div className="d-flex flex-row">
                      <div className="col-3" title={formatDate(e.createdAt)}>
                        {e.inBlock}
                      </div>
                      <div className="col-3">{fixGroupName(e.groupId)}</div>
                      <div
                        className="col-6"
                        title={`member ${e.worker.membership?.id}`}
                      >
                        {e.worker.membership.handle}
                      </div>
                    </div>
                    {e.rationale ? (
                      <div
                        className="col-12 mb-2 text-right overflow-hidden"
                        title={e.rationale}
                      >
                        {e.rationale}
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                ))}
              </div>

              <h4>Exited</h4>
              <div>
                {sortDesc(workersExited, "inBlock").map((e, i) => (
                  <div key={`worker-exit` + i} className="d-flex flex-row">
                    <div className="col-3" title={formatDate(e.createdAt)}>
                      {e.inBlock}
                    </div>
                    <div className="col-3">{fixGroupName(e.groupId)}</div>
                    <div
                      className="col-6"
                      title={`member ${e.worker.membership?.id}`}
                    >
                      {e.worker.membership.handle}
                    </div>
                  </div>
                ))}
              </div>

              <h4>Slashes</h4>
              <div>
                {sortDesc(stakesSlashed, "inBlock").map((e, i) => (
                  <div key={`slash` + i} className="d-flex flex-row">
                    <div className="col-3" title={formatDate(e.createdAt)}>
                      {e.inBlock}
                    </div>
                    <div className="col-3">{fixGroupName(e.groupId)}</div>
                    <div
                      className="col-4"
                      title={`member ${e.worker.membership?.id}`}
                    >
                      {e.worker.membership.handle}
                    </div>
                    <div className="col-2">{e.slashedAmount}</div>
                  </div>
                ))}
              </div>

              <h4>Role Updated</h4>
              <div>
                {sortDesc(workerRoleUpdated, "inBlock").map((e, i) => (
                  <div key={`role-update` + i} className="d-flex flex-row">
                    <div className="col-2" title={formatDate(e.createdAt)}>
                      {e.inBlock}
                    </div>
                    <div className="col-3">{fixGroupName(e.workerId)}</div>
                    <div
                      className="col-7"
                      title={`member ${e.worker.membership?.id}`}
                    >
                      {e.worker.membership.handle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-6">
              <h4>Reward Updated</h4>
              <div>
                {sortDesc(workerRewardUpdated, "inBlock").map((e, i) => (
                  <div key={`reward-update` + i} className="d-flex flex-row">
                    <div className="col-3" title={formatDate(e.createdAt)}>
                      {e.inBlock}
                    </div>
                    <div className="col-3">{fixGroupName(e.groupId)}</div>
                    <div
                      className="col-5"
                      title={`member ${e.worker.membership?.id}`}
                    >
                      {e.worker.membership.handle}
                    </div>
                    <div className="col-1">{e.newRewardPerBlock}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-12">
          <h3 className="mt-3">Openings</h3>
          <div className="d-flex flex-wrap">
            <div className="col-8">
              <h4>Added</h4>
              <div>
                {sortDesc(openingAdded, "inBlock").map((e, i) => (
                  <div
                    key={`opening-` + i}
                    className="d-flex flex-row"
                    title={
                      e.opening.id + ":\n" + e.opening.metadata.description
                    }
                  >
                    <div className="col-2" title={formatDate(e.createdAt)}>
                      {e.inBlock}
                    </div>
                    <div className="col-3">{fixGroupName(e.groupId)}</div>
                    <div className="col-7">{e.opening.metadata.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-4">
              <h4>Canceled</h4>
              <div>
                {sortDesc(openingCanceled, "inBlock").map((e, i) => (
                  <div
                    key={`cancel` + i}
                    className="d-flex flex-row"
                    title={e.openingId}
                  >
                    <div className="col-4" title={formatDate(e.createdAt)}>
                      {e.inBlock}
                    </div>
                    <div className="col-8">{fixGroupName(e.groupId)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Round;
