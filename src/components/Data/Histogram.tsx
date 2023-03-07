import Histogram from "react-chart-histogram";

const Graph = (props: {}) => {
  const { objects, label, show } = props;
  if (!show) return <div />;

  // plot count per bitrate range
  const max = objects.reduce(
    (max, o) => (o.bitrate < max ? max : o.bitrate),
    0
  );
  console.debug(`max`, max, objects.count);
  let labels = [];
  let data = [];
  const step = 100000;

  for (let i = step; i < 1500000; i += step) {
    const count = objects.filter(
      (o) => o.bitrate > i - step && o.bitrate < i
    ).length;
    const label =
      i < 1000000
        ? (i / 1000).toFixed() + "K"
        : (i / 1000 ** 2).toFixed(1) + "M";
    labels.push(label);
    data.push(count);
  }
  const options = {
    scaleLineColor: "#000",
    scaleFontColor: "#000",
    scaleGridLineColor: "#000",
    fillColor: "#0000FF",
    strokeColor: "#0000FF",
  };
  return (
    <div>
      <Histogram
        className="bg-light"
        xLabels={labels}
        yValues={data}
        width="400"
        height="250"
        options={options}
      />
      <div className="mb-2 text-secondary">{label}</div>
    </div>
  );
};

export default Graph;