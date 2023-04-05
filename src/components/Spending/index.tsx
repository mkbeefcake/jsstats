import React from "react";
import { sortDesc } from "../../lib/util";
import Round from "./Round";
import { useElectedCouncils } from "@/hooks";
import { gql, useQuery } from '@apollo/client';
import { bounties, councilBudgetRefills, councilSalaryChanges, councilSalaryPayouts, openings, wgBudgetRefills, wgSpending, workerChanges, workerPayments } from "@/queries_";

const Rounds = (props: {}) => {
  const {
    // bounties,
    // councils,
    // wgSpending,
    // wgBudgetRefills,
    // councilBudgetRefills,
    // councilSalaryPayouts,
    // workerPayments,
    // councilSalaryChanges,
    // openings,
    // workerChanges,
  } = props;

  const _electedCouncil = useElectedCouncils({});
  const _wgSpending = useQuery(gql(wgSpending));
  const _wgBudgetRefills = useQuery(gql(wgBudgetRefills));
  const _councilBudgetRefills = useQuery(gql(councilBudgetRefills));
  const _councilSalaryPayouts = useQuery(gql(councilSalaryPayouts));
  const _workerPayments = useQuery(gql(workerPayments));
  const _councilSalaryChanges = useQuery(gql(councilSalaryChanges));
  const _openings = useQuery(gql(openings));
  const _workerChanges = useQuery(gql(workerChanges));
  const _bounties = useQuery(gql(bounties));

  const filterEvents = (list: any, start: any, end: any) =>
    list?.length ? list.filter((e: any) => e.inBlock > start && (!end || e.inBlock < end)) : [];

  if ((_electedCouncil?.loading == false) && 
      (_wgSpending?.loading == false) &&
      (_wgBudgetRefills?.loading == false) && 
      (_councilBudgetRefills?.loading == false) && 
      (_councilSalaryPayouts?.loading == false) && 
      (_workerPayments?.loading == false) && 
      (_councilSalaryChanges?.loading == false) && 
      (_openings?.loading == false) && 
      (_workerChanges?.loading == false) && 
      (_bounties?.loading == false)) {

    console.log(`Rounding: All information fetched`, 
      _electedCouncil?.data,
      _wgSpending.data, _wgBudgetRefills.data, _councilBudgetRefills.data, _councilSalaryPayouts.data,
      _workerPayments.data, _councilSalaryChanges.data, _openings.data, _workerChanges.data, _bounties.data);
    return sortDesc(_electedCouncil?.data, "id").map(
      (c, i, member) => (
        <Round
          key={`elected` + c.electedAt.number}
          bounties={_bounties?.data.bounties}
          round={c.id}
          data={[
            _wgSpending?.data.budgetSpendingEvents,
            _wgBudgetRefills?.data.budgetRefillEvents,
            _councilBudgetRefills?.data.budgetRefillEvents,
            _councilSalaryPayouts?.data.rewardPaymentEvents,
            _workerPayments?.data.rewardPaidEvents,
            _councilSalaryChanges?.data.councilorRewardUpdatedEvents,
            _openings?.data.openingAddedEvents,
            _openings?.data.openingCanceledEvents,
            _openings?.data.openingFilledEvents,
            _workerChanges?.data.terminatedWorkerEvents,
            _workerChanges?.data.workerExitedEvents,
            _workerChanges?.data.stakeSlashedEvents,
            _workerChanges?.data.workerRewardAmountUpdatedEvents,
            _workerChanges.data.workerRoleAccountUpdatedEvents,
          ].map((list) => filterEvents(list, c.electedAt.number, c.endedAt?.number))}
          {...c}
          />
      )
    )
  }
  else {
    return <></>;
  }

  // return sortDesc(councils?.electedCouncils, "electedAtBlock").map(
  //   (c, i: number) => (
  //     <Round
  //       key={`elected` + c.electedAtBlock}
  //       bounties={sortDesc(bounties?.bounties, "createdInEvent.block").filter(
  //         (b) =>
  //           b.createdInEvent.block > c.electedAtBlock &&
  //           b.createdInEvent.block < c.endedAtBlock
  //       )}
  //       round={councils.electedCouncils.length - i}
  //       data={[
  //         wgSpending?.budgetSpendingEvents,
  //         wgBudgetRefills?.budgetUpdatedEvents,
  //         councilBudgetRefills?.budgetRefillEvents,
  //         councilSalaryPayouts?.rewardPaymentEvents,
  //         workerPayments?.rewardPaidEvents,
  //         councilSalaryChanges?.councilorRewardUdatedEvents,
  //         openings?.openingAddedEvents,
  //         openings?.openingCanceledEvents,
  //         openings?.openingFilledEvents,
  //         workerChanges?.terminatedWorkerEvents,
  //         workerChanges?.workerExitedEvents,
  //         workerChanges?.stakeSlashedEvents,
  //         workerChanges?.workerRewardAmountUpdatedEvents,
  //         workerChanges?.workerRoleAccountUpdatedEvents,
  //       ].map((list) => filterEvents(list, c.electedAtBlock, c.endedAtBlock))}
  //       {...c}
  //     />
  //   )
  // );
};

export default Rounds;
