import { useState } from "react";
import { Button } from "react-bootstrap";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import Json from "./Json";
import moment from "moment";
import { Edit, RefreshCw, Trash } from "react-feather";

const Data = (props: {}) => {
  const { queries, save, fetchQuery, saveQuery } = props;
  const [expandQueries, setExpandQueries] = useState([]);

  const toggleResult = (name) =>
    setExpandQueries(
      expandQueries.includes(name)
        ? expandQueries.filter((n) => n !== name)
        : expandQueries.concat(name)
    );

  if (!queries) return <div />;
  return (
    <>
      <div className="box">
        <h3>Queries</h3>
      </div>
      <div>
        {queries.map(([name, lifetime, query, active]) => (
          <div key={`query-` + name} className="box mb-2 text-left">
            <h4>{name}</h4>
            <div>
              status:{" "}
              <Button
                variant={active ? "success" : "danger"}
                className="btn-sm"
                onClick={() => saveQuery([name, lifetime, query, !active])}
              >
                {active ? "Active" : "Disabled"}
              </Button>
            </div>
            <div>lifetime: {lifetime}h</div>
            <div>
              last update:{" "}
              {props[name]?.timestamp
                ? moment(props[name].timestamp).fromNow()
                : "never"}
              <RefreshCw
                className="ml-2"
                onClick={() => fetchQuery(name, query)}
              />
              <Trash className="ml-2" onClick={() => save(name, null)} />
            </div>
            <Edit className="float-right m-2" color="black" />
            <div className="bg-light my-1 p-2">
              <Markdown plugins={[gfm]} children={"```\n" + query + "\n```"} />
            </div>
            <Button className="btn-sm my-1" onClick={() => toggleResult(name)}>
              {expandQueries.includes(name) ? "Hide" : "Show"} result
            </Button>

            {expandQueries.includes(name) ? (
              props[name] ? (
                <Json src={props[name]} />
              ) : (
                <div>Loading ..</div>
              )
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Data;
