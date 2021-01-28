import React from "react";
import { Handles, Category, Post, Thread } from "../../types";
import NavBar from "./NavBar";
import Content from "./Content";

interface IProps {
  match?: { params: { thread: string } };
  block: number;
  posts: Post[];
  categories: Category[];
  threads: Thread[];
  handles: Handles;
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

  getMinimal(array: { id: number }[]) {
    if (!array.length) return " ";
    let id = array[0].id;
    array.forEach((p) => {
      if (p.id < id) id = p.id;
    });
    if (id > 1) return id;
  }

  filterPosts(posts: Post[], s: string) {
    return s === ""
      ? posts
      : posts.filter(
          (p) =>
            p.text.toLowerCase().includes(s) ||
            this.props.handles[p.authorId].includes(s)
        );
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

  render() {
    const { block, now, handles, categories, posts, threads } = this.props;
    const { categoryId, threadId, searchTerm } = this.state;

    const startTime: number = now - block * 6000;

    const category = categoryId
      ? categories.find((c) => c.id === categoryId)
      : undefined;
    const thread = threadId
      ? threads.find((t) => t.id === threadId)
      : undefined;

    return (
      <div className="h-100 overflow-hidden bg-dark">
        <NavBar
          selectCategory={this.selectCategory}
          selectThread={this.selectThread}
          getMinimal={this.getMinimal}
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
          handles={handles}
          startTime={startTime}
          searchTerm={searchTerm}
          filterPosts={this.filterPosts}
          filterThreads={this.filterThreads}
        />
      </div>
    );
  }
}

export default Forum;
