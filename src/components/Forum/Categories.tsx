import React from "react";
//import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Category, Thread } from "../../types";

const Categories = (props: {
  categories: Category[];
  threads: Thread[];
  selectCategory: (id: number) => void;
}) => {
  const { selectCategory, categories, threads } = props;
  return (
    <div>
      <h2>Categories</h2>
      {categories.map((c) => (
        <div key={c.id} onClick={() => selectCategory(c.id)}>
          {c.title} ({threads.filter((t) => t.categoryId === c.id).length})
        </div>
      ))}
    </div>
  );
};

export default Categories;
