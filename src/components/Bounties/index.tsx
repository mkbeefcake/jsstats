import { useState, useMemo } from "react";
import { Button } from "react-bootstrap";
import Json from "../Data/Json";
import { sortDesc } from "../../lib/util";

const Bounties = (props: {}) => {
  const { bounties } = props;
  //console.log(`b`, bounties);
  const [stage, setStage] = useState("WorkSubmission");

  let stages = useMemo(() => {
    let stgs = {};
    if (bounties?.bounties?.length) bounties.bounties.forEach((b) => stgs[b.stage]++);
    return Object.keys(stgs);
  }, [bounties]);

  return (
    <div className="box">
      <h1>Bounties</h1>
      <div>
        {stages.map((s) => (
          <Button key={s}
            variant={s === stage ? "warning" : "info"}
            onClick={() => setStage(s)}
          >
            {s}
          </Button>
        ))}
      </div>
      <div className="d-flex flex-column mt-2">
        {bounties?.bounties
          ? sortDesc(
              bounties.bounties?.filter((b) => b.stage === stage),
              "createdAt"
            ).map((b) => (
              <div key={b.id} className="text-left mb-2">
                <h4>
                  <a
                    href={`https://dao.joystream.org/#/bounties/preview/${b.id}`}
                  >
                    {b.title}
                  </a>
                </h4>
                <div className="m-1">by {b.creator.handle}</div>
                <Json src={b} />
              </div>
            ))
          : "Loading .."}
      </div>
    </div>
  );
};
export default Bounties;
