import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { IState } from "../../types";

interface IProps extends IState {
  blocks: { id: number; events: any }[];
}

const Events = (props: IProps) => {
  const [hidden,setHidden] = useState(['ExtrinsicSuccess'])
  const { blocks, selectEvent } = props;

  // all methods and sections
  const methods = []
  const sections = []
  blocks.forEach(block=> block.events?.forEach(event => {
    if (!methods.includes(event.method)) methods.push(event.method)
    if (!sections.includes(event.section)) sections.push(event.section)
  }))

  // filter hidden methods and sections
  const filteredBlocks = blocks
    .filter((b) => b.timestamp > 164804000000)
    .filter(b=> b.events?.filter(e=> !hidden.includes(e.section) && !hidden.includes(e.method)).length)
    .sort((a, b) => b.id - a.id)

  const toggleHide = (item) => {
     if (hidden.includes(item)) setHidden(hidden.filter(h=> h !== item))
     else setHidden(hidden.concat(item))
  }

  return (
    <div className="p-3 text-light">
      <div>
        <div>Synced {blocks.length} blocks.</div>
        <b>Sections</b>
        {sections.map((s,i)=> <Button variant={hidden.includes(s) ? 'outline-dark' : 'dark'} className='btn-sm p-1 m-1 mr-1' key={i} onClick={()=>toggleHide(s)} title={`Click to ${hidden.includes(s) ? `show` : `hide`}`}>{s}</Button>)}
      </div>
      <div>
        <b>Methods</b>
        {methods.map((m,i)=> <Button variant={hidden.includes(m) ? 'outline-dark' : 'dark'} className='btn-sm p-1 m-1 mr-1' key={i} onClick={()=>toggleHide(m)} title={`Click to ${hidden.includes(m) ? `show` : `hide`}`}>{m}</Button>)}
      </div>
      <div className='mt-2'>
     {filteredBlocks.map((block) => (
          <div key={block.id} className="d-flex flex-wrap px-2">
            #{block.id}
            {block.events?.filter(e=> !hidden.includes(e.section) && !hidden.includes(e.method)).map((event, index: number) => (
              <Badge
                key={index}
                variant="success"
                className="ml-1"
                title={JSON.stringify(event.data)}
                onClick={() => selectEvent(event)}
              >
                {event.section}.{event.method}
              </Badge>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
