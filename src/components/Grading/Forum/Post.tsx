import { useState } from "react";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import moment from "moment";
import Notion from "../../Notion";

const Post = (props: { post: any }) => {
  const { post, selected } = props;
  const [show, setShow] = useState(true);
  if (!post) return <div />;
  const notion = post.text.match(/notion.site\/([^\s]\)]+)/g);
  let ids = [];
  notion
    ?.map((l) => l.match(/[^-]+$/))
    .forEach((array) => ids.includes(array[0]) || ids.push(array[0]));

  return (
    <>
      <Notion ids={ids} />
      <div
        className={`mb-1 p-2 bg-${selected === post.id ? "dark" : "secondary"}`}
        onClick={() => setShow(!show)}
      >
        <small className="float-right">
          created: {moment(post.createdAt).format("DD/MM/YYYY HH:mm")}
        </small>
        {show ? (
          <Markdown plugins={[gfm]} children={post.text} />
        ) : (
          <div>{post.text.slice(0, 200)}...</div>
        )}
      </div>
    </>
  );
};
export default Post;
