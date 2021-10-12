import { useState } from "react";

import Details from "./KpiDetails";
import Stats from "./KpiStats";

const KPI = (props: {
  kpi: any;
  id: string;
  edit: string;
  toggleEdit: (any) => void;
}) => {
  const { id, start, end, toggleEdit } = props;
  const [showDetails, toggleDetails] = useState(false);
  const kpi = { id, ...props.kpi };
  return (
    <>
      <Stats
        kpi={kpi}
        start={start}
        end={end}
        showDetails={showDetails}
        toggleDetails={toggleDetails}
        toggleEdit={toggleEdit}
      />
      <Details kpi={kpi} show={showDetails} toggleEdit={toggleEdit} />
    </>
  );
};

export default KPI;
