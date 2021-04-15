import React from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import moment from "moment";

const Posts = (props: {
  posts: Post[];
  threadTitle: (id: number) => string;
  startTime: number;
}) => {
  const { domain, posts, startTime, threadTitle } = props;

  if (!posts.length) return <div />;

  return (
    <div className="mt-3">
      <h3 className="text-center text-light">Latest Posts</h3>
      {posts
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
        .map((p) => (
          <div key={p.id} className="box d-flex flex-row">
            <div className="col-2 mr-3">
              <div>
                {moment(startTime + p.createdAt.block * 6000).fromNow()}
              </div>
              <a href={`${domain}/#/forum/threads/${p.threadId}`}>reply</a>
            </div>

            <div>
              <Link to={`/forum/threads/${p.threadId}`}>
                <div className="text-left font-weight-bold mb-3">
                  {threadTitle(p.threadId)}
                </div>
              </Link>

              <Markdown
                plugins={[gfm]}
                className="overflow-auto text-left"
                children={p.text}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Posts;
