import React from "react";
import {  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Summary = (props: {
  classes;
  answers: number[];
  survey: SurveyItem[];
}) => {
  const { classes, answers, survey } = props;
  return (
    <div>
      <h2>Thank you very much!</h2>
      {survey.map((item: SurvayItem, index: number) => (
        <Accordion className={classes.acc} key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
            aria-controls={`${index}-content`}
            id={`${index}-header`}
          >
            <Typography className={classes.heading}>{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answers[answers[index]]}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Summary