import React from "react";
import { Button } from "react-bootstrap";
import { Category, Thread, Post } from "../../types";

const Loading = (props: {
  getMinimal: (array: { id: number }[]) => any;
  categories: Category[];
  threads: Thread[];
  posts: Post[];
}) => {
  const { getMinimal, categories, threads, posts } = props;
  const categoryId = getMinimal(categories);
  const threadId = getMinimal(threads);
  const postId = getMinimal(posts);

  const strCategories = categoryId ? `${categoryId} categories, ` : "";
  const strThreads = threadId ? `${threadId} threads, ` : "";
  const strPosts = postId ? `${postId} posts ` : "";

  if (`${strCategories}${strThreads}${strPosts}` === "") return <div />;

  return (
    <Button variant="secondary" className="btn-sm ml-auto">
      Fetching {strCategories} {strThreads} {strPosts}
    </Button>
  );
};

export default Loading;
