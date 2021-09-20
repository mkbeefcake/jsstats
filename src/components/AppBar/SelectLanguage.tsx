import { useTranslation } from "react-i18next";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import { useStyles } from "./config";

const SelectLanguage = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { language, store } = i18n;
  const languages = Object.keys(store.data);
  return (
    <FormControl fullWidth>
      <Select
        id="select-lang"
        className={classes.select}
        variant="outlined"
        defaultValue={language}
        value={language}
        children={languages.map((l) => (
          <MenuItem
            className={classes.selectItem}
            key={l}
            value={l}
            onClick={() => i18n.changeLanguage(l)}
          >
            {t(`lang.${l}`)}
          </MenuItem>
        ))}
      />
    </FormControl>
  );
};

export default SelectLanguage;
