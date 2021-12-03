import React from "react";
import { Table } from "react-bootstrap";
import { Tokenomics } from "../../types";

const mJoy = (joy: number) =>
  joy ? (joy / 1000000).toFixed(3) + ` M JOY` : `Loading ..`;

const Overview = (props: { groups: any[]; tokenomics: Tokenomics }) => {
  const { groups, tokenomics } = props;
  const { price, totalIssuance, dollarPool } = tokenomics;
  const validators = groups.find((g) => g.id === "validators");
  const council = groups.find((g) => g.id === "council");
  const budget = dollarPool.replenishAmount;
  const minted = groups.reduce((sum, { earning }) => sum + +earning, 0);
  const staked = groups.reduce((sum, { stake }) => sum + +stake, 0);

  return (
    <Table className="w-50 m-auto">
      <tbody>
        <tr>
          <td>Exchange Rate</td>
          <td>{(+price * 1000000).toFixed(2)} $/M JOY</td>
        </tr>
        <tr>
          <td>Total Issuance</td>
          <td>{mJoy(totalIssuance)} </td>
        </tr>
        <tr>
          <td>Fiat Pool</td>
          <td>${dollarPool.size.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Weekly Budget</td>
          <Budget budget={budget} pool={dollarPool.size} />
        </tr>
        <tr>
          <td>Weekly Minting</td>
          <Minted minted={minted} issuance={totalIssuance} />
        </tr>
        <tr>
          <td>Weekly Mint Value</td>
          <MintedValue value={minted * +price} budget={budget} />
        </tr>
        <tr>
          <td>Weekly Inflation</td>
          <Inflation
            budget={budget}
            pool={dollarPool.size}
            minted={minted}
            issuance={totalIssuance}
          />
        </tr>
        <tr>
          <td>Total Stake</td>
          <td>{mJoy(staked)}</td>
        </tr>
        <tr>
          <td>Staked Value</td>
          <StakedValue
            staked={staked}
            price={+price}
            issuance={totalIssuance}
          />
        </tr>
      </tbody>
    </Table>
  );
};

export default Overview;

const Budget = (props: { budget: number; pool: value }) => {
  const { budget, pool } = props;
  if (!budget) return <td>Loading ..</td>;
  const budgetPercent = ((100 * budget) / pool).toFixed(2);
  return (
    <>
      <td>${budget}</td>
      <td>{budgetPercent}% / Fiat Pool</td>
    </>
  );
};

const Minted = (props: { minted: numbr; issuance: number }) => {
  const { minted, issuance } = props;
  if (!minted) return <td>Loading ..</td>;
  const mintedPercent = ((100 * minted) / issuance).toFixed(2);
  return (
    <>
      <td>{mJoy(minted)}</td>
      <td>{mintedPercent}% / Issuance</td>
    </>
  );
};

const MintedValue = (props: { value: numbr; budget: number }) => {
  const { value, budget } = props;
  if (!value) return <td>Loading ..</td>;
  const percent = (100 * value) / budget;
  return (
    <>
      <td>${value.toFixed(2)}</td>
      <td>{percent.toFixed(2)}% / Budget</td>
    </>
  );
};

const StakedValue = (props: {
  staked: number;
  price: number;
  issuance: number;
}) => {
  const { staked, price, issuance } = props;
  if (!staked) return <td>Loading ..</td>;
  const percent = (100 * staked) / issuance;
  return (
    <>
      <td>${(staked * price).toFixed(2)}</td>
      <td>{percent.toFixed(1)}% / Issuance</td>
    </>
  );
};

const Inflation = (props: {
  budget: number;
  pool: number;
  minted: number;
  issuance: number;
}) => {
  const { budget, pool, minted, issuance } = props;
  if (!minted) return <td>Loading ..</td>;
  const inflation = 100 * (minted / issuance - budget / pool);
  return <td>{inflation.toFixed(2)}%</td>;
};
