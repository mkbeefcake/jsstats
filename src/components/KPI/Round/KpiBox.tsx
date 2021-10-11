import { useState } from "react";
import { Button } from "react-bootstrap";
import { Edit } from "react-feather";

import Markdown from "react-markdown";
import gfm from "remark-gfm";

const KPI = (props: { kpi: any; id: string; edit: string }) => {
  const { kpi, edit, id, start, end, toggleEdit } = props;
  const [showDetails, toggleShowDetails] = useState(false);
  const {
    title,
    reward,
    fiatPool,
    distribution,
    process,
    active,
    purpose,
    scope,
    rewardDistribution,
  } = kpi;

  if (edit === id) return <div id={id}>Form here</div>;

  return (
    <div
      id={id}
      className="m-2 col-12 col-md-5 col-lg-3"
      onClick={() => toggleShowDetails(!showDetails)}
    >
      <Button variant="secondary" className="p-0 btn-sm float-right">
        <Edit onClick={() => toggleEdit(id)} />
      </Button>

      <b>{title}</b>

      <ul>
        <li>
          <b>Reward:</b> {reward}
        </li>
        <li>
          <b>Fiat Pool Factor:</b> {fiatPool}
        </li>
        <li>
          <b>Reward Distribution:</b> {distribution}
        </li>
        <li>
          <b>Grading Process:</b> {process}
        </li>
        <li>
          <b>Active:</b> {active}
          <ul>
            <li>
              <b>Start Block:</b> {start}
            </li>
            <li>
              <b>End Block:</b> {end}
            </li>
          </ul>
        </li>
      </ul>

      {showDetails ? (
        <>
          {purpose ? (
            <div>
              <h6>Purpose</h6>
              <Markdown
                plugins={[gfm]}
                className="overflow-auto text-left"
                children={purpose}
              />
            </div>
          ) : (
            ""
          )}
          {scope ? (
            <div>
              <h6>Scope of Work</h6>
              {scope.length ? (
                scope.map((text) => (
                  <Markdown
                    plugins={[gfm]}
                    className="overflow-auto text-left"
                    children={text}
                  />
                ))
              ) : (
                <Markdown
                  plugins={[gfm]}
                  className="overflow-auto text-left"
                  children={scope}
                />
              )}
            </div>
          ) : (
            ""
          )}
          {rewardDistribution ? (
            <Markdown
              plugins={[gfm]}
              className="overflow-auto text-left"
              children={rewardDistribution}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default KPI;
