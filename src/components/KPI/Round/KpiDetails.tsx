import { Button } from "react-bootstrap";
import { Edit } from "react-feather";

import Markdown from "react-markdown";
import gfm from "remark-gfm";

const Details = (props) => {
  const { show, kpi, toggleEdit } = props;
  const { id, title, purpose, scope, rewardDistribution } = kpi;

  if (!show) return <div />;
  return (
    <div className="w-100 bg-dark p-3">
      <Button variant="" className="p-0 btn-sm float-right">
        <Edit color="white" onClick={() => toggleEdit(kpi)} />
      </Button>

      <h2>
        {id} {title}
      </h2>

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
            scope.map((text, i) => (
              <Markdown
                key={i}
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
    </div>
  );
};

export default Details;
