import { useState, useMemo } from "react";
import { Button } from "react-bootstrap";
import { IState } from "../../types";
import Day from './Day'
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
    <div className="text-light p-2">
    <div className="box text-left m-0">
      <div className="d-flex flex-row">
        <b className="col-1">Search</b>
	<input type='text' name='filter' value={filter} onChange={handleChange} className="col-6 px-1 mb-2" size={50} />
 	<span className="ml-2">
	  {blocks.length} of {head} blocks synced.
	</span>
      </div>
      <div className="d-flex flex-row">
        <b className="col-1">Sections</b>
        <div className="d-flex flex-wrap">
          {sections.map((s,i)=> <Button variant={hidden.includes(s) ? 'outline-dark' : 'dark'} className='btn-sm p-1 mr-1 mb-1' key={i} onClick={()=>toggleHide(s)} title={`Click to ${hidden.includes(s) ? `show` : `hide`}`}>{s}</Button>)}
	</div>
      </div>
      <div className="d-flex flex-row">
        <b className="col-1">Methods</b>
	<div className="d-flex flex-wrap">
          {methods.map((m,i)=> <Button variant={hidden.includes(m) ? 'outline-dark' : 'dark'} className='btn-sm p-1 mr-1 mb-1' key={i} onClick={()=>toggleHide(m)} title={`Click to ${hidden.includes(m) ? `show` : `hide`}`}>{m}</Button>)}
	</div>
      </div>
     </div>

     {Object.keys(days).map((day) => <Day key={day} day={day} applyFilter={applyFilter} filter={filter} blocks={days[day]} hidden={hidden} />)}
    </div>
  );
};

export default Events;
