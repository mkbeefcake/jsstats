import { makeStyles, createStyles, Theme } from "@material-ui/core";

export const electionStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
    },
    appBar: {
      flexGrow: 1,
      backgroundColor: "#4038FF",
    },
    title: {
      textAlign: "left",
      flexGrow: 1,
    },
    acc: {
      color: "#fff",
      backgroundColor: "#000",
      defautExpanded: true,
      expanded: true,
    },
    grid: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    applicants: {
      marginTop: theme.spacing(1),
      textAlign: "center",
    },
    applicant: {
      padding: 6,
      border: "1px solid #4038FF",
      transition: "0.5s",
      "&:hover": {
        border: "1px solid #FFF",
        background: "#fff",
        color: "#000",
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
      position: "absolute",
      width: "100%",
    },
    paper: {
      textAlign: "center",
      backgroundColor: "#000",
      color: "#fff",
      minHeight: 600,
      maxHeight: 800,
      overflow: "auto",
      marginBottom: 4,
      marginTop: 4,
    },
    chips: {
      display: "flex",
      justifyContent: "center",
      "& > *": {
        margin: theme.spacing(1, 1, 1, 0),
      },
    },
    stakeChip: {
      margin: theme.spacing(1),
    },
    accSummary: {
      textAlign: "center",
      color: "#fff",
      backgroundColor: "#4038FF",
    },
    badge: {
      marginTop: theme.spacing(1),
    },
    backersTooltip: {
      cursor: "pointer",
    },
    backerInfo: {
      textAlign: "center",
    },
    dividerPrimary: {
      backgroundColor: "#4038FF",
    },
  })
);

export const tooltipStyles = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    border: "1px solid #fff",
    backgroundColor: "#4038FF",
    fontSize: "0.8rem",
  },
}));
