import { useState, useMemo } from "react";
import { Badge, Button } from "react-bootstrap";
import { IState } from "../../types";
import moment from 'moment'

interface IProps extends IState {
  blocks: { id: number; events: any }[];
}

const getMethodsAndSections = (blocks) => {
  const sections = []
  const methods = []
  blocks.forEach(block=> block.events?.forEach(event => {
    if (!sections.includes(event.section)) sections.push(event.section)
    if (!methods.includes(event.method)) methods.push(event.method)
  }))
  return [sections, methods]
}

const applyFilter = (event, filter) => {
    if (!filter.length) return true
    if (event.section.includes(filter) || event.method.includes(filter)) return true
    if (JSON.stringify(event.data).includes(filter)) return true
    return false
}

const filterBlocks = (blocks, filter, hidden) => blocks.filter((b) => b.timestamp > 164804000000)
    .filter(b=> b.events?.filter(e=> !hidden.includes(e.section) && !hidden.includes(e.method) && applyFilter(e, filter)).length)
    .sort((a, b) => b.id - a.id)

const getDays = (blocks) => {
  const days = {}
  blocks.forEach(b => {
    const day = moment(b.timestamp).format('MMM D YYYY')
    if (!days[day]) days[day] = []
    days[day].push(b)
  })
  return days
}

const Events = (props: IProps) => {
  //console.debug(`hidden event sections and methods`, props.hidden)
  const [hidden,setHidden] = useState(props.hidden)
  const [filter,setFilter] = useState('')
  const { blocks, save, selectEvent } = props;
  const head = blocks.reduce((max, b)=> b.id > max ? b.id : max, 0)
  
  const [sections, methods] = useMemo(() => getMethodsAndSections(blocks), [blocks])
  const filteredBlocks = useMemo(() => filterBlocks(blocks, filter, hidden), [blocks, filter, hidden])
  const days = useMemo(() => getDays(filteredBlocks), [filteredBlocks])

  const handleChange = (e) => setFilter(e.target.value)
  const toggleHide = (item) => {
     if (hidden.includes(item)) setHidden(save('hidden', hidden.filter(h=> h !== item)))
     else setHidden(save('hidden',hidden.concat(item)))     
  }

  return (
    <div className="p-3 text-light">
    <div className="box text-left">
      <div>    
        <b className="col-1">Search</b> <input type='text' name='filter' value={filter} onChange={handleChange} size={50} />
 	<span className="ml-2">
	  {blocks.length} of {head} blocks synced.
	</span>
      </div>
      <div>
        <b className="col-1">Sections</b>
        {sections.map((s,i)=> <Button variant={hidden.includes(s) ? 'outline-dark' : 'dark'} className='btn-sm p-1 m-1 mr-1' key={i} onClick={()=>toggleHide(s)} title={`Click to ${hidden.includes(s) ? `show` : `hide`}`}>{s}</Button>)}
      </div>
      <div>
        <b className="col-1">Methods</b>
        {methods.map((m,i)=> <Button variant={hidden.includes(m) ? 'outline-dark' : 'dark'} className='btn-sm p-1 m-1 mr-1' key={i} onClick={()=>toggleHide(m)} title={`Click to ${hidden.includes(m) ? `show` : `hide`}`}>{m}</Button>)}
      </div>
     </div>

     {Object.keys(days).map((day) =>
     <div className='mt-2 ml-2 p-1'>
      <h2 className='col-2 text-right' onClick={() => toggleHide(day)}>{day}</h2>
      {hidden.includes(day) ? <div/> : (
       <div className='mt-2'>
        {days[day].sort((a,b)=>b.id-a.id).map((block) => (
          <div key={block.id} className="d-flex flex-row px-2">
           <b className="col-1 text-right">#{block.id}</b>
	   {moment(block.timestamp).format('HH:mm:ss')}
           <div key={block.id} className="col-8 d-flex flex-wrap px-2">	    
            {block.events?.filter(e=> !hidden.includes(e.section) && !hidden.includes(e.method) && applyFilter(e, filter))
	      .map((event, index: number) => (
              <Badge
                key={index}
                variant="success"
                className="ml-1 mb-1"
                title={JSON.stringify(event.data)}
                onClick={() => selectEvent(event)}
              >
                {event.section}.{event.method}
              </Badge>
            ))}
	    </div>
          </div>
        ))}
       </div>
      )}       
      </div>
     )}
    </div>
  );
};

export default Events;
