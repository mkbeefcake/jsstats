import { useState, useEffect } from "react";
import Term from "./Term";
import axios from "axios";

const scoresUrl = `https://joystreamstats.live/static/grading/scores/scores.csv`;

const csv2json = (lines: string) =>
  lines.split("\n").map((line) => line.split(","));

const Scores = (props: { groups: any[] }) => {
  const { save, scores = [0] } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scores || loading) return;
    setLoading(true);
    console.info(`Fetching scores`);
    axios
      .get(scoresUrl)
      .then(({ data }) => {
        console.debug(`Received scores`, save("scores", csv2json(data)));
        setLoading(false);
      })
      .catch((e) => {
        console.warn(`Failed to fetch scores: ${e.message}`);
        setLoading(false);
      });
  }, [save, loading, scores]);

  return (
    <div className="box">
      <h1>Scores</h1>
      <div className="d-flex flex-column">
        {scores
          ? scores
              .slice(1)
              .sort((a, b) => +b[4] - +a[4])
              .map((c, row) => (
                <Term key={`term${row}`} fields={scores[0]} values={c} />
              ))
          : "Loading .."}
      </div>
    </div>
  );
};

export default Scores;
