import { useState } from "react";
import { PlusSquare, Moon, Sun } from "react-feather";
import moment from "moment";

const Notes = (props: {}) => {
  const { log, save, notes, note, settings = {} } = props;
  const [text, setText] = useState(notes[note]);
  const [lastSave, setLastSave] = useState(moment().valueOf());

  const setExpand = (expand: string) => {
    if (settings.expandNotes === expand) return;
    settings.expandNotes = expand;
    save("settings", settings);
    log("d", "expandNotes", expand);
  };
  const setTheme = (theme: string) => {
    if (settings.theme === theme) return;
    settings.theme = theme;
    log("d", "settings", settings);
  };

  const scheduleSave = (text) => {
    setText(text);
    if (moment().diff(lastSave, "seconds") < settings.saveInterval) return;
    notes[note] = text;
    save("notes", notes);
    setLastSave(moment().valueOf());
    console.debug(lastSave, "saved notes");
  };

  //console.debug("notes", show, note, notes);

  const setNote = (note) => save("note", note);
  const handleChange = (e) => scheduleSave(e.target.value);

  if (!settings.showNotes) return <div />;
  const darkMode = settings.theme === "dark";
  const theme = darkMode ? "bg-dark text-light" : "bg-light text-secondary";
  //console.debug(settings);

  return (
    <div
      className={`pb-1 pl-1 d-flex flex-column overflow-hidden ` + theme}
      style={{ width: settings.expandNotes ? "100%" : "20%" }}
    >
      <div className="d-flex flex-row py-1">
        <select onChange={setNote} className={`form-control ` + theme}>
          {Object.keys(notes).map((n, i: number) => (
            <option key={i}>{n}</option>
          ))}
        </select>
        <PlusSquare
          onClick={() => setExpand(!settings.expandNotes)}
          className="m-1"
          strokeWidth="1"
          size="30px"
        />
        {darkMode ? (
          <Sun
            onClick={() => setTheme("light")}
            size="30px"
            className="m-1"
            strokeWidth="1"
          />
        ) : (
          <Moon
            onClick={() => setTheme("dark")}
            size="30px"
            className="m-1"
            strokeWidth="1"
          />
        )}
      </div>
      <textarea
        className={`h-100 form-control ` + theme}
        onChange={handleChange}
        defaultValue={text}
      />
    </div>
  );
};

export default Notes;
