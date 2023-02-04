import { useState } from "react";
//const { Client } = require("@notionhq/client");
//const auth = "";
//const notion = new Client({ auth });

const Notion = (props: { id: string }) => {
  const { ids } = props;
  const [pages, setPages] = useState([]);

  const getPage = (page_id) => {
    notion.pages
      .retrieve({ page_id })
      .then((response) => {
        console.debug(content);
        setPages(pages.concat({ id: page_id, content }));
      })
      .catch((e) => console.warn(`Failed to fetch notion page: ${e.message}`));
  };

  //useEffect(() => {  }, []);
  if (!ids) return <div />;
  return (
    <div>
      {ids.map((id) => (
        <Page
          id={id}
          page={pages.find((p) => p.id_id === id)}
          getPage={getPage}
          //          showPage={showPage}
        />
      ))}
    </div>
  );
};

export default Notion;

const Page = (props: { page: any }) => {
  const { id, page, getPage } = props;
  if (!page)
    return (
      <div
        key={`notion-` + id}
        onClick={() => getPage(id)}
        title="click to load"
      >
        Notion:{id}
      </div>
    );
  return <div key={id}>{page.content}</div>;
};
