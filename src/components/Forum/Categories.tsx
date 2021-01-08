import React from "react";
import { Button } from "react-bootstrap";
import { Category, Post, Thread } from "../../types";

const Categories = (props: {
  categories: Category[];
  threads: Thread[];
  selectCategory: (id: number) => void;
}) => {
  const categories = props.categories.map((c) => {
    const threads: Thread[] = props.threads.filter(
      (t) => t.categoryId === c.id
    );
    return { ...c, threads };
  });
  return (
    <div className="overflow-auto" style={{ height: "90%" }}>
      <div className="box">
        {categories
          .filter((c) => c.threads.length)
          .map((c) => (
            <Button
              variant="dark"
              className="btn-sm m-1"
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
