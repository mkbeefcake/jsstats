import React from "react";
import { sortDesc } from "../../lib/util";
import Round from "./Round";

const Rounds = (props: {}) => {
  const {
    bounties,
    councils,
    wgSpending,
    wgBudgetRefills,
    councilBudgetRefills,
    councilSalaryPayouts,
    workerPayments,
    councilSalaryChanges,
    openings,
    workerChanges,
  } = props;

  const filterEvents = (list, start, end) =>
    list?.length
      ? list.filter((e) => e.inBlock > start && (!end || e.inBlock < end))
      : [];

  return sortDesc(councils?.electedCouncils, "electedAtBlock").map(
    (c, i: number) => (
      <Round
        key={`elected` + c.electedAtBlock}
        bounties={sortDesc(bounties?.bounties, "createdInEvent.block").filter(
          (b) =>
            b.createdInEvent.block > c.electedAtBlock &&
            b.createdInEvent.block < c.endedAtBlock
        )}
        round={councils.electedCouncils.length - i}
        data={[
          wgSpending?.budgetSpendingEvents,
          wgBudgetRefills?.budgetUpdatedEvents,
          councilBudgetRefills?.budgetRefillEvents,
          councilSalaryPayouts?.rewardPaymentEvents,
          workerPayments?.rewardPaidEvents,
          councilSalaryChanges?.councilorRewardUdatedEvents,
          openings?.openingAddedEvents,
          openings?.openingCanceledEvents,
          openings?.openingFilledEvents,
          workerChanges?.terminatedWorkerEvents,
          workerChanges?.workerExitedEvents,
          workerChanges?.stakeSlashedEvents,
          workerChanges?.workerRewardAmountUpdatedEvents,
          workerChanges?.workerRoleAccountUpdatedEvents,
        ].map((list) => filterEvents(list, c.electedAtBlock, c.endedAtBlock))}
        {...c}
      />
    )
  );
};

export default Rounds;
