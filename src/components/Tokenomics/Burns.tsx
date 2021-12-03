import React from "react";
import Chart from "../Chart";
import { Link } from "react-router-dom";
import { Exchange } from "../../types";

const Burns = (props: {
  exchanges: Exchange[];
  extecutedBurnsAmount: number;
}) => {
  if (!props.exchanges) return <div />;

  const data = props.exchanges.map((b) => {
    return {
      time: b.logTime.split("T")[0],
      amount: Math.floor(b.amountUSD),
      status: b.status,
    };
  });
  const executed = Math.floor(props.extecutedBurnsAmount / 100000) / 10;

  return (
    <div className="p-5">
      <h2 className="m-3 text-center">Burns</h2>
      <Chart
        data={data}
        x="time"
        y="amount"
        xLabel="Date"
        yLabel="$"
        scaleY={true}
        pixels={150}
        barStyle={(o: Exchange) =>
          o.status === "PENDING" ? `bg-warning` : `bg-danger`
        }
      />
      <div className="my-1 text-left">
        Total Amount Burned: {executed} M JOY
      </div>
      <Link to={`/burners`}>Top Burners</Link>
    </div>
  );
};

export default Burns;
