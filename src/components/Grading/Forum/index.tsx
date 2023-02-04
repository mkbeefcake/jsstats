import { useState } from "react";
import { Button } from "react-bootstrap";
import Post from "./Post";
import { ChevronRight } from "react-feather";
import moment from "moment";

const Forum = (props: { categories: any[] }) => {
  const { categories } = props;
  const menu = categories
    .filter((c) => !c.parent)
    .reduce((all, c) => all.concat(c), []);
  const [category, selectCategory] = useState(3);
  const parent = categories.find((c) =>
    c.forumcategeroyparent?.includes(category)
  );
  //console.debug(`category`, category, parent);

  if (!categories) return <div />;
  return (
    <>
      <div className="d-flex flex-wrap mb-2">
        {menu.map((c) => (
          <Button
            key={`menu-category-` + c.id}
            variant={
              category === c.id ||
              c.forumcategoryparent.find((p) => p.id === category)
                ? "warning"
                : "dark"
            }
            className="mr-1 btn-sm mb-1"
            onClick={() => selectCategory(c.id)}
          >
            {c.title}
          </Button>
        ))}
      </div>
      <Category
        category={categories.find((c) => c.id === category)}
        parent={parent}
        selectCategory={selectCategory}
      />
    </>
  );
};
export default Forum;

const Category = (props: {}) => {
  const { category, selectCategory, parent } = props;
  const [show, setShow] = useState(true);
  if (!category) return <div />;
  const children = parent?.forumcategoryparent
    ? category.forumcategoryparent.concat(...parent.forumcategoryparent)
    : category.forumcategoryparent;

  //if (category.parent) console.debug(`parent`, category.parent);

  return (
    <>
      {category.parent && (
        <div className="text-left mt-2 mb-0">
          <span onClick={() => selectCategory(category.parent.id)}>
            {category.parent.title} <ChevronRight />
          </span>
          <span onClick={() => setShow(!show)}>{category.title}</span>
        </div>
      )}
      <div className="d-flex flex-wrap mb-2">
        {children.map((c) => (
          <Button
            key={c.id}
            variant="info"
            className={`mr-1 btn-sm mb-1`}
            onClick={() => selectCategory(c.id)}
          >
            {c.title}
          </Button>
        ))}
      </div>
      <Threads showAll={show} threads={category.threads} />
    </>
  );
};

const Threads = (props: {}) => {
  const { showAll, threads } = props;
  const [selected, selectThread] = useState(287);
  //console.debug("thread", selected);

  return (
    <>
      <div className="d-flex flex-wrap mb-2">
        {showAll &&
          threads.map((t) => (
            <Button
              key={`thread-` + t.id}
              variant={selected === t.id ? "danger" : "success"}
              className="mr-1 btn-sm mb-1"
              onClick={() => selectThread(t.id)}
              title={`created ${moment(t.createdAt).format("DD/MM/YYYY")}`}
            >
              {t.title}
            </Button>
          ))}
      </div>
      <Thread thread={threads.find((t) => t.id === selected)} />
    </>
  );
};

const Thread = (props: { thread: any }) => {
  const { thread } = props;
  const [show, setShow] = useState(true);
  if (!thread) return <div />;

  return (
    <div>
      <h4 className="d-none text-left mt-2" onClick={() => setShow(!show)}>
        {thread.title}
      </h4>
      {show && <Posts posts={thread.posts} />}
    </div>
  );
};

const Posts = (props: { posts: any[] }) => {
  const { posts } = props;
  return (
    <div className="d-flex flex-column text-left">
      {posts.map((p) => (
        <Post key={`post-` + p.id} post={p} onClick={() => selectPost(p.id)} />
      ))}
    </div>
  );
};
