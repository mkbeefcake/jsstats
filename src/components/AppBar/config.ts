import { StyleRules } from "@material-ui/core";

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
  election: "Election"
};

export const css: StyleRules<"appBar" | "appLogo" | "lang" | "navBar" | "navBarLink" | "toolBar"> = {
  appBar: {
    flexDirection: "row",
    backgroundColor: "#000",
    color: "#fff",
  },
  appLogo: {
    display: "block",
    width: "150px",
    color: "#4038ff",
  },
  lang: {
    position: "fixed",
    right: "0px",
    top: "0px",
  },
  navBar: {
    "&:hover": {
      backgroundColor: "#4038ff",
    },
  },
  navBarLink: { color: "#fff" },
  toolBar: {
    paddingLeft: "12px",
    backgroundColor: "#000",
    textAlign: "center",
  },
};
