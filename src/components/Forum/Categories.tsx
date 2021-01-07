import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Category, Thread } from "../../types";

const Categories = (props: {
  categories: Category[];
  threads: Thread[];
  selectCategory: (id: number) => void;
}) => {
  const { selectCategory, categories, threads } = props;
  return (
    <div className="box">
      {categories.map((c) => (
        <Button
          variant="dark"
          className="btn-sm m-1"
          key={c.id}
          onClick={() => selectCategory(c.id)}
        >
          {c.title} ({threads.filter((t) => t.categoryId === c.id).length})
        </Button>
      ))}
    </div>
  );
};

export default Categories;
