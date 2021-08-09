import React from "react";
import { Category, Post, Thread } from "../../types";
import NavBar from "./NavBar";
import Content from "./Content";

interface IProps {
  match?: { params: { thread: string } };
  block: number;
  posts: Post[];
  categories: Category[];
  threads: Thread[];
  now: number;
}
interface IState {
  categoryId: number;
  threadId: number;
  postId: number;
  searchTerm: string;
}

class Forum extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { categoryId: 0, threadId: 0, postId: 0, searchTerm: "" };
    this.getMissing = this.getMissing.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.selectThread = this.selectThread.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
    this.filterThreads = this.filterThreads.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    const { match } = this.props;
    if (match && match.params.thread)
      match.params.thread && this.selectThread(parseInt(match.params.thread));
  }

  handleKeyDown(event: { key: string }) {
    const { key } = event;
    if (key !== "Escape") return;
    if (this.state.threadId) return this.selectThread(0);
    if (this.state.categoryId) return this.selectCategory(0);
  }

  handleChange(e: { target: { value: string } }) {
    this.setState({ searchTerm: e.target.value.toLowerCase() });
  }

  selectCategory(categoryId: number) {
    this.setState({ categoryId });
  }
  selectThread(threadId: number) {
    this.setState({ threadId });
  }

  filterPosts(posts: Post[], s: string) {
    return s === ""
      ? posts
      : posts.filter((p) => {
          const handle = p.author.handle;
          const text = p.text.toLowerCase();
          return text.includes(s) || handle.includes(s);
        });
  }

  filterThreads(list: any[], s: string) {
    return s === ""
      ? list
      : list.filter((i) => i.title.toLowerCase().includes(s));
  }

  getLatest() {
    let threads: number[] = [];
    let categories: number[] = [];
    let posts = this.filterPosts(this.props.posts, this.state.searchTerm)
      .sort((a, b) => b.id - a.id)
      .slice(0, 20);
    posts.forEach((p) => {
      const thread = this.props.threads.find((t) => t.id === p.threadId);
      if (!thread) return;
      threads.push(thread.id);
      categories.push(thread.categoryId);
    });
    return { posts, threads, categories };
  }

  getMissing(target: string) {
    return this.props.status[target] - this.props[target].length;
  }

  render() {
    const { categories, posts, threads, status } = this.props;
    const { categoryId, threadId, searchTerm } = this.state;

    const category = categories.find((c) => c.id === categoryId);
    const thread = threads.find((t) => t.id === threadId);

    return (
      <div className="h-100 overflow-hidden bg-dark">
        <NavBar
          selectCategory={this.selectCategory}
          selectThread={this.selectThread}
          getMinimal={this.getMissing}
          categories={categories}
          category={category}
          threads={threads}
          thread={thread}
          posts={posts}
          handleChange={this.handleChange}
          searchTerm={searchTerm}
        />
        <Content
          latest={this.getLatest()}
          selectCategory={this.selectCategory}
          selectThread={this.selectThread}
          categories={categories}
          threads={threads}
          posts={posts}
          category={category}
          thread={thread}
          startTime={status.startTime}
          searchTerm={searchTerm}
          filterPosts={this.filterPosts}
          filterThreads={this.filterThreads}
        />
      </div>
    );
  }
}

export default Forum;
