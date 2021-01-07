import React from "react";
import { Handles, Category, Post, Thread } from "../../types";
import NavBar from "./NavBar";
import Content from "./Content";

interface IProps {
  block: number;
  posts: Post[];
  categories: Category[];
  threads: Thread[];
  handles: Handles;
}
interface IState {
  categoryId: number;
  threadId: number;
  postId: number;
}

class Forum extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { categoryId: 0, threadId: 0, postId: 0 };
    this.selectCategory = this.selectCategory.bind(this);
    this.selectThread = this.selectThread.bind(this);
    this.selectPost = this.selectPost.bind(this);
  }

  selectCategory(categoryId: number) {
    this.setState({ categoryId });
  }
  selectThread(threadId: number) {
    this.setState({ threadId });
  }
  selectPost(postId: number) {
    this.setState({ postId });
  }

  getMinimal(array: { id: number }[]) {
    if (!array.length) return `all`;
    let id = array[0].id;
    array.forEach((p) => {
      if (p.id < id) id = p.id;
    });
    if (id > 1) return id;
  }

  render() {
    const { handles, categories, posts, threads } = this.props;
    const { categoryId, threadId, postId } = this.state;

    const category = categoryId
      ? categories.find((c) => c.id === categoryId)
      : undefined;
    const thread = threadId
      ? threads.find((t) => t.id === threadId)
      : undefined;
    const post = postId ? posts.find((p) => p.id === postId) : undefined;

    return (
      <div className="h-100 overflow-hidden bg-dark">
        <NavBar
          selectCategory={this.selectCategory}
          selectThread={this.selectThread}
          selectPost={this.selectPost}
          getMinimal={this.getMinimal}
          categories={categories}
          category={category}
          threads={threads}
          thread={thread}
          posts={posts}
        />
        <Content
          selectCategory={this.selectCategory}
          selectThread={this.selectThread}
          selectPost={this.selectPost}
          categories={categories}
          threads={threads}
          posts={posts}
          category={category}
          thread={thread}
          post={post}
          handles={handles}
        />
      </div>
    );
  }
}

export default Forum;
