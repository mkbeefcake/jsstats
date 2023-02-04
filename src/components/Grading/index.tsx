import { useState, useEffect } from "react";
import axios from "axios";
import Forum from "./Forum/";
import Groups from "./Groups";
import Elastic from "./Elastic";
import { queryNode } from "../../config";
import Scores from "./Scores";

const getQuery = (
  start: number,
  end: number
) => `query { rewardPaidEvents (where: {inBlock_gt: ${start}, inBlock_lt: ${end} }, limit: 10000) {
    inBlock amount groupId worker { membership{handle} rewardPerBlock missingRewardAmount
} } }`;

const Grading = (props: {}) => {
  const { save, scores, grading } = props;
  const [payments, setPayments] = useState([]);
  const [groups, setGroups] = useState(
    props.groups ? Object.keys(props.groups) : []
  );
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(props.categories);

  const getCategories = () => {
    if (loading || categories?.length) return;
    const query = `query { forumCategories { id title parent {id title}
  forumcategoryparent { id title }
  threads { id title createdAt createdById deletedAt posts { id createdAt createdById text deletedAt } }
}}`;

    console.debug(`fetching forum`);
    axios
      .post(queryNode, { query })
      .then(({ data }) => {
        const categories = data.data.forumCategories;
        setCategories(categories);
        save("categories", categories);
        console.debug(`Received ${categories.length} forum categories`);
      })
      .catch((e) => console.warn(`Failed to fetch forum data: ${e.message}`));
  };

  useEffect(getCategories, [categories, loading, save]);

  useEffect(() => {
    const getWorkers = () => {
      if (groups?.length) return;
      setLoading(true);
      axios
        .post(queryNode, { query: getQuery(1152000, 1252800) })
        .then(({ data }) => {
          console.debug(`received payments`, data.data);
          setPayments(data.data.rewardPaidEvents);
          let groups = [];
          data.data.rewardPaidEvents.forEach((p) => {
            const group = p.groupId.replace("WorkingGroup", "");
            if (!groups[group])
              groups[group] = { name: group, spent: 0, workers: [] };
            groups[group].spent += +p.amount;
            const { handle } = p.worker.membership;
            if (!groups[group].workers[handle])
              groups[group].workers[handle] = 0;
            groups[group].workers[handle] += +(+p.amount);
          });
          console.debug(`group spendings`, Object.values(groups));
          setGroups(save("groups", Object.values(groups)));
          setLoading(false);
        })
        .catch((e) => {
          console.error(`Failed to fetch salaries: ${e.message}`);
          setLoading(false);
        });
    };

    if (!loading && !groups.length) getWorkers();
  }, [save, loading, groups.length, payments]);

  return (
    <>
      <Elastic show={false} />
      <Scores save={save} scores={scores} />
      <div className="box">
        <h3>Forum</h3>
        {categories?.length ? (
          <Forum categories={categories} />
        ) : (
          "Loading categories .."
        )}
      </div>
      <div className="box">
        {groups.length ? (
          <Groups groups={groups} save={save} grading={grading} />
        ) : (
          "Fetching groups .."
        )}
      </div>
    </>
  );
};

export default Grading;
