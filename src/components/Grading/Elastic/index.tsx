import { useState, useEffect } from "react";
//import * as ElasticAppSearch from "@elastic/app-search-javascript";
import axios from "axios";
import Json from "react-json-view";

const elasticBackend = "https://elastic.joystreamstats.live";

const Elastic = (props: {}) => {
  const [result, setResult] = useState();
  const [query] = useState({
    search_fields: { title: {} },
    result_fields: { id: { raw: {} }, title: { raw: {} } },
  });
  const [loading, setLoading] = useState(false);
  const shouldFetch = props.show && !result && !loading;

  useEffect(() => {
    setLoading(true);
    axios
      .get(elasticBackend + "/_search", query)
      .then(({ data }) => {
        console.debug("success:", data);
        setResult(data);
        setLoading(false);
      })
      .catch((e) => {
        console.warn("fail:", e.message);
        setLoading(false);
      });
  }, [shouldFetch, query]);

  if (!props.show) return <div />;
  return (
    <div className="box">
      <h3>Elastic!</h3>
      <div className="d-flex flex-row text-left bg-light p-3 text-info">
        <div className="col-6">
          <small>Query</small>
          <Json src={query} collapsed={true} />
        </div>
        <div className="col-6">
          <small>Response</small>
          {result ? (
            <Json src={result} collapsed={true} />
          ) : (
            <div>Testing {elasticBackend} ..</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Elastic;
