import { Block } from "../../types";
import moment from "moment";

const Blocks = (props: { blocks: Block[] }) => {
  const blocks: Block[] = props.blocks
    .sort((a: Block, b: Block) => b.timestamp - a.timestamp)
    .slice(0, 10);
  return (
    <div>
      <h3>previous blocks</h3>
      <div>
        {blocks.map(b => (
          <div>
            {moment(b.timestamp).format("DD/MM/YYYY HH:mm:ss")}: {b.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blocks;
