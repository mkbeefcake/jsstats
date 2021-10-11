import { Button } from "react-bootstrap";
import { RefreshCw } from "react-feather";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

import TOC from "../TOC";
import Stats from "./Stats";
import KPI from "../KpiBox";

const Round = (props) => {
  const { edit, toggleEditKpi, focus, fetchKpi } = props;
  const { round, notes, kpis, startBlock, endBlock } = props.round;
  return (
    <div>
      <Button variant="secondary" className="p-1 btn-sm float-right">
        <RefreshCw onClick={fetchKpi} />
      </Button>

      <TOC focus={focus} round={props.round} />
      <h3>Round {round}</h3>
      <Stats round={round} />

      <Markdown
        plugins={[gfm]}
        className="overflow-auto text-left"
        children={notes}
      />

      {kpis.sections.map((section, index: number) => (
        <div key={index} id={`#${round}-${index}`}>
          <h4>{section.name}</h4>
          <div className="d-flex flex-wrap">
            {section.kpis.map((kpi, i: number) => (
              <KPI
                key={i}
                toggleEdit={toggleEditKpi}
                id={`#${round}-${index + 1}-${i + 1}`}
                kpi={kpi}
                edit={edit}
                start={startBlock}
                end={endBlock}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Round;
