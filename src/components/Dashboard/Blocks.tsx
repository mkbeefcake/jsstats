import moment from "moment";

const Blocks = props => {
  const blocks = props.blocks
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);
  return (
    <div>
      <h3>previous blocks</h3>
      <div>
        {blocks.map(b => (
          <div>
            {moment(b.timestamp).format("DD/MM/YYYY HH:mm:ss")}:{" "}
            {b.number.toNumber()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blocks;
