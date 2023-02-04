import { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import Group from "./Group";
import axios from "axios";

const Groups = (props: { groups: any[] }) => {
  const { groups = [], save } = props;
  const menu = groups.reduce((all, g) => all.concat(g.name), []);
  const [group, selectGroup] = useState(menu[0]);
  const [grading, setGrading] = useState(props.grading || []);
  const [loading, setLoading] = useState(false);
  const gradingAvailable = useMemo(
    () => ["storage", "distribution", "content", "forum"].includes(group),
    [group]
  );
  const gradingUrl = `https://joystreamstats.live/static/grading12/${group}.json`;

  useEffect(() => {
    if (!gradingAvailable) return;
    if (grading.find((g) => g.group === group)) return;
    setLoading(true);
    if (loading) return;
    console.debug(`Fetching grading info for group ${group}`);
    axios
      .get(gradingUrl)
      .then(({ data }) => {
        setGrading(save("grading", grading.concat({ group, data })));
        console.debug(`Received grading info for ${group}`, data);
        setLoading(false);
      })
      .catch((e) => {
        console.warn(`Failed to fetch ${group} grading: ${e.message}`);
        setLoading(false);
      });
  }, [save, loading, grading, gradingAvailable, gradingUrl, group]);

  if (loading) return <div>Loading ...</div>;
  return (
    <>
      <div className="box d-flex flex-row text-light">
        {menu.map((key, index: number) => (
          <Button
            key={`group-` + index}
            variant={group === key ? "dark" : "info"}
            className="mr-1 btn-sm"
            onClick={() => selectGroup(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      <Group
        group={groups.find((g) => g.name === group)}
        grading={grading.find((g) => g.group === group)}
        gradingAvailable={gradingAvailable}
        gradingUrl={gradingUrl}
      />
    </>
  );
};

export default Groups;
