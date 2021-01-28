import React from "react";
import { Button } from "react-bootstrap";
import { Category, Thread } from "../../types";

const Categories = (props: {
  categories: Category[];
  threads: Thread[];
  selectCategory: (id: number) => void;
  latest: number[];
}) => {
  const categories = props.categories.map((c) => {
    const threads: Thread[] = props.threads.filter(
      (t) => t.categoryId === c.id
    );
    return { ...c, threads };
  });

  const getColor = (id: number) => {
    return props.latest.find((i) => i === id) ? "bg-secondary" : "";
  };

  if (!categories.length) return <div />;

  return (
    <div className="overflow-auto" style={{ maxHeight: "30%" }}>
      <div className="box">
        {categories
          .filter((c) => c.threads.length)
          .sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0))
          .map((c) => (
            <Button
              variant="dark"
              className={`btn-sm m-1 ${getColor(c.id)}`}
              key={c.id}
              onClick={() => props.selectCategory(c.id)}
            >
              {c.title} ({c.threads.length})
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Categories;
