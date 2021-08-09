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
  faq: "FAQ",
};

export const css = {
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
  navBar: {
    "&:hover": {
      backgroundColor: "#4038ff",
    },
  },
  navBarLink: { color: "#fff" },
  toolBar: { paddingLeft: "12px", backgroundColor: "#000", textAlign: "center" },
};
