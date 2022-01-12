import { Member, Stake } from "../types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  })
);

const mJoy = (mJoy: number) => (mJoy / 1000000).toFixed(1) + ` M`;
const getSum = (stakes) => stakes.reduce((sum, { value }) => sum + value, 0);

const getNominators = (stakes: Stake[], members: Member[]) => {
  let nominators = {};
  Object.keys(stakes).forEach((validator) =>
    stakes[validator].others.forEach(({ who, value }) => {
      if (!nominators[who]) nominators[who] = [];
      const member = members.find((m) => m.rootKey === validator);
      nominators[who].push({ validator, handle: member?.handle, value });
    })
  );
  return Object.keys(nominators)
    .map((nominator) => {
      const stakes = nominators[nominator];
      const sum = getSum(stakes);
      const member = members.find((m) => m.rootKey === nominator);
      return { key: nominator, handle: member?.handle, sum, stakes };
    })
    .sort((a, b) => b.sum - a.sum);
};

const Nominators = (props: { members: Member[]; stakes: Stake[] }) => {
  const { showAll = false, stakes, members } = props;
  const nominators = getNominators(stakes, members);
  return (
    <div className="mt-3 overflow-hidden">
      <h2 className="text-center">Nominators</h2>
      <div className="d-flex flex-column" style={{ overFlowY: true }}>
        {nominators.slice(0, showAll ? null : 10).map((nominator) => (
          <Nominator key={nominator.key} nominator={nominator} />
        ))}
      </div>
    </div>
  );
};

export default Nominators;

const Nominator = (props: {
  nominator: {
    who: string;
    sum: number;
    stakes: { validator: string; value: number }[];
  };
}) => {
  const classes = useStyles();
  const { key, handle, sum, stakes } = props.nominator;
  return (
    <Accordion className={classes.acc} key={key}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
        aria-controls={`${key}-content`}
        id={`${key}-header`}
      >
        <div className="d-flex flex-row justify-content-start w-100">
          <div className="col-2 text-right">{mJoy(sum)}</div>
          <div className="col-10">{handle || key}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="d-flex flex-column w-100">
          {stakes
            .sort((a, b) => b.value - a.value)
            .map((stake) => (
              <div
                key={stake.validator}
                className="d-flex flex-row justify-content-end text-left"
              >
                <div className="col-2 text-right">{mJoy(stake.value)}</div>

                <a className="col-10 text-left" href={`#${stake.validator}`}>
                  {stake.handle || stake.validator}
                </a>
              </div>
            ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
