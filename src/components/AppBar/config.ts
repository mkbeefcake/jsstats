import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const routes = {
  dashboard: "Dashboard",
  calendar: "Calendar",
  timeline: "Timeline",
  tokenomics: "Tokenomics",
  validators: "Validators",
  "validator-report": "Validator Report",
  storage: "Storage",
  spending: "Spending",
  transactions: "Transfers",
  burners: "Top Burners",
  mint: "Mints",
  kpi: "KPI",
  faq: "FAQ",
  survey: "Survey",
  issues: "Issues",
  election: "Election",
} as { [key: string]: string };

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: "#fff",
      background: "#000",
      textAlign: "left",
    },
    drawer: {
      color: "#000",
      '& .MuiDrawer-paper': {
        background: "#000",
        width: 200,
      },
    },
    menuButton: {
      margin: 0,
      color: "#fff"
    },
    select: {
      color: "#fff",
      background: "#000",
      fontSize: "0.875rem",
      fontWeight: 500,
      "& > *": {
        textAlign: "center",
        textTransform: "uppercase",
        color: "#fff",
      },
    },
    selectItem: {
      textTransform: "uppercase",
    },
    appBar: {
      background: "#000",
      color: "#fff",
    },
    appLogo: {
      margin: theme.spacing(1),
      display: "block",
      width: "200px",
      background: "#000",
      color: "#4038ff",
      "&:hover": {
        background: "#111",
      }
    },
  })
);
