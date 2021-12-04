import React, { useState } from "react";
import Chart from "../Chart";

const calculateTokenValue = (exchanges: any[]) => {
  const tokenValue = {};
  exchanges
    .filter((e) => e.date)
    .forEach((e) => {
      const date = e.date.split("T")[0];
      tokenValue[date] = { date, price: (e.price * 1000000).toFixed(1) };
    });
  return tokenValue;
};

const TokenValue = (props: { tokenValue: any }) => {
  const { exchanges } = props;
  const [tokenValue] = useState(calculateTokenValue(exchanges));

  return (
    <div className="p-5 text-center">
      <Chart
        data={Object.values(tokenValue).sort((a, b) => a.date - b.date)}
        x="date"
        y="price"
        xLabel="Date"
        yLabel="$"
        scaleY={true}
        pixels={1000}
      />
    </div>
  );
};

export default TokenValue;
