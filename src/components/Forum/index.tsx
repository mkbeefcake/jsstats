import React from "react";
//import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Category, Post, Thread } from "../../types";
import Categories from "./Categories";
import CategoryThreads from "./Category";

interface IProps {
  block: number;
  posts: Post[];
  categories: Category[];
  threads: Thread[];
}
interface IState {
  category: number;
  thread: number;
  post: number;
}

class Forum extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { category: 0, thread: 0, post: 0 };
    this.selectCategory = this.selectCategory.bind(this);
    this.selectThread = this.selectThread.bind(this);
    this.selectPost = this.selectPost.bind(this);
  }

  selectCategory(category: number) {
    this.setState({ category });
  }
  selectThread(thread: number) {
    this.setState({ thread });
  }
  selectPost(post: number) {
    this.setState({ post });
  }

  render() {
    const { categories, posts, threads } = this.props;
    const { category, thread } = this.state;

    return (
      <div className="h-100 overflow-hidden bg-light">
        <h1>Forum</h1>
        {category ? (
          <CategoryThreads
            selectCategory={this.selectCategory}
            selectThread={this.selectThread}
            selectPost={this.selectPost}
            category={categories.find((c) => c.id === category)}
            threads={threads.filter((t) => t.categoryId === category)}
            thread={thread}
            posts={posts}
          />
        ) : (
          <Categories
            selectCategory={this.selectCategory}
            categories={categories}
            threads={threads}
          />
        )}
      </div>
    );
  }
}

export default Forum;
