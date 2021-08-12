import { useTranslation } from "react-i18next";
import { MenuItem, Select } from "@material-ui/core";

const SelectLanguage = (props: { classes: string }) => {
  const { t, i18n } = useTranslation();
  const { language, store } = i18n;
  const languages = Object.keys(store.data);
  return (
    <div className={props.classes}>
      <Select
        id="select-lang"
        className="form-control"
        variant="outlined"
        autoWidth={true}
        defaultValue={language}
        value={language}
        children={languages.map((l) => (
          <MenuItem key={l} value={l} onClick={() => i18n.changeLanguage(l)}>
            {t(`lang.${l}`)}
          </MenuItem>
        ))}
      />
    </div>
  );
};

export default SelectLanguage;
