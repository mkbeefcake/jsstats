import React from "react";
import Chart from "../Chart";
import { Link } from "react-router-dom";
import { Exchange } from "../../types";

const Burns = (props: {
  exchanges: Exchange[];
  executed: number;
  percent: number;
}) => {
  const { exchanges, executed, percent } = props;
  if (!exchanges) return <div />;

  const data = exchanges.map((b) => {
    return {
      time: b.logTime.split("T")[0],
      amount: Math.floor(b.amountUSD),
      status: b.status,
    };
  });
  const pctRounded = (100 * percent).toFixed(2);
  return (
    <div className="p-5">
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
      <div className="my-1 ">
        Total Amount Burned: {executed.toFixed(2)} M JOY ({pctRounded}%) -{" "}
        <Link to={`/burners`}>Top Burners</Link>
      </div>
    </div>
  );
};

export default Burns;
