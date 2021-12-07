import Applications from "./Applications";
import Details from "./Details";
import InfoTooltip from "../Tooltip";
import { domain } from "../../config";

import { Opening } from "./types";

const GroupOpening = (props: { group: string; opening: Opening }) => {
  const { group, opening } = props;
  const { id, type, applications } = opening;
  const details = JSON.parse(opening.human_readable_text);
  return (
    <div>
      <InfoTooltip placement="bottom" title={<Details object={details} />}>
        <a
          className="font-weight-bold mr-2"
          href={`${domain}/#/working-groups/opportunities/${group}${
            opening.type === "leader" ? "/lead" : ""
          }`}
        >
          {opening.type} opening ({opening.wgOpeningId})
        </a>
      </InfoTooltip>
      <Applications applications={opening.applications} />
    </div>
  );
};

export default GroupOpening;
