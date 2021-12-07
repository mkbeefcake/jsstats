import { createStyles, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightBold,
    },
    answer: {
      fontSize: theme.typography.pxToRem(18),
      fontWeight: theme.typography.fontWeightRegular,
      marginBottom: ".5em",
    },
  })
);

const ObjectKeys = (props: { object }) => {
  const classes = useStyles();
  const { object } = props;
  if (!object) return <div />;

  return Object.keys(object).map((key, index: number) =>
    typeof object[key] === "object" ? (
      <ObjectKeys key={index} object={object[key]} />
    ) : (
      <div key={index}>
        <Typography className={classes.heading}>{key}</Typography>
        <Typography className={classes.answer}>{object[key]}</Typography>
      </div>
    )
  );
};

export default ObjectKeys;
