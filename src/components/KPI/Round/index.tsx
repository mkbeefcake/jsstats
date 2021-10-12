import { Button } from "react-bootstrap";
import { RefreshCw } from "react-feather";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

import TOC from "./TOC";
import Stats from "./Stats";
import KPI from "./KpiBox";

const Round = (props) => {
  const { toggleEditKpi, focus, fetchKpi } = props;
  const { round, notes, kpis, startBlock, endBlock } = props.round;

  return (
    <div>
      <Button variant="" className="p-1 btn-sm float-right">
        <RefreshCw onClick={fetchKpi} />
      </Button>

      <div className="d-flex flex-wrap">
        <div className="col-12 col-lg-5">
          <TOC focus={focus} round={props.round} />
          <h3>Round {round}</h3>
          <Stats round={props.round} />

          <Markdown
            plugins={[gfm]}
            className="overflow-auto text-left"
            children={notes}
          />
        </div>
        <div className="col-12 col-lg-7">
          {kpis.sections.map((section, index: number) => (
            <div key={index} id={`${round}-${section.id}`}>
              <h4>{section.name}</h4>
              <div className="d-flex flex-wrap">
                {section.kpis.map((kpi, i: number) => (
                  <KPI
                    key={i}
                    id={`${round}-${section.id}-${i + 1}`}
                    toggleEdit={toggleEditKpi}
                    kpi={kpi}
                    start={startBlock}
                    end={endBlock}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Round;
