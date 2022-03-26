import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import {eventsStyles} from './styles'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Badge } from "react-bootstrap";
import moment from 'moment'

const Day = (props:{}) => {
const classes = eventsStyles();
const { applyFilter, filter, day, blocks, hidden } = props

return (
       <div className='mt-2'>
            <Accordion key={day}
	      className={classes.acc}
	      TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary
                className={classes.accSummary}
                expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
                aria-controls={`${day}-content`}
                id={`${day}-header`}
              >
                <Typography variant="h6">{day}</Typography>
              </AccordionSummary>

              <AccordionDetails>
       <div className='d-flex flex-column'>
        {blocks.sort((a,b)=>b.id-a.id).map((block) => (
          <div key={block.id} className="d-flex flex-row px-2">
           <div className="col-1" title={block.timestamp}>
	     {moment(block.timestamp).format('HH:mm:ss')}
	     <b className="ml-2">#{block.id}</b>
	   </div>

           <div key={block.id} className="col-10 d-flex flex-wrap px-2">
            {block.events?.filter(e=> !hidden.includes(e.section) && !hidden.includes(e.method) && applyFilter(e, filter))
	      .map((event, block: number) => (
              <Badge
                key={block}
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
              </AccordionDetails>
            </Accordion>
	</div>
  )
}

export default Day