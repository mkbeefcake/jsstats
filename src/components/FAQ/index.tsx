import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useEffect } from "react";
import { useState } from "react";
import { FAQItem } from "../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
    },
    acc: {
      color: "#fff",
      backgroundColor: "#4138ff",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
);

const FAQ = (props: { faq: FAQItem[] }) => {
  const classes = useStyles();
  const { faq } = props;
  return (
    <Grid className={classes.root} item lg={12}>
      <Typography variant="h2" className="mb-3">
        FAQ
      </Typography>
      {faq.map((item: FAQItem, index: number) => {
        return (
          <Accordion className={classes.acc} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
              aria-controls={`${index}-content`}
              id={`${index}-header`}
            >
              <Typography className={classes.heading}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Grid>
  );
};

export default FAQ;
