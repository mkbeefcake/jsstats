import React from "react";
import { Loading } from "..";
import { Category, Thread, Post } from "../../types";

const Missing = (props: {
  getMinimal: (array: { id: number }[]) => any;
  categories: Category[];
  threads: Thread[];
  posts: Post[];
}) => {
  const { getMinimal } = props;
  const categories = getMinimal("categories");
  const threads = getMinimal("threads");
  const posts = getMinimal("posts");

  const strCategories = categories > 0 ? `${categories} categories, ` : "";
  const strThreads = threads > 0 ? `${threads} threads, ` : "";
  const strPosts = posts > 0 ? `${posts} posts ` : "";
  const summary = `${strCategories} ${strThreads} ${strPosts}`;
  if (summary.length === 2) return <div />;

  return <Loading target={summary} />
};

export default Missing;
