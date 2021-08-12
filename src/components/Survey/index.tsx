import React from "react";
import { Trans } from "react-i18next";
import PropTypes from "prop-types";
import { Grid, withStyles, Theme, Typography } from "@material-ui/core";
import { Button } from "react-bootstrap";
import Summary from "./Summary";
import { SurveyItem } from "../../types";
import axios from "axios";

interface IState {
  loading: boolean;
  started: boolean;
  survey: SurveyItem[];
  answers: number[];
}

const styles = (theme: Theme) => ({
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
});

class Survey extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      started: false,
      survey: [],
      answers: [],
    };

    this.loadSurvey = this.loadSurvey.bind(this);
    this.startSurvey = this.startSurvey.bind(this);
    this.saveAnswer = this.saveAnswer.bind(this);
  }
  componentDidMount() {
    this.loadSurvey();
  }

  async loadSurvey() {
    this.setState({ loading: true });
    const { data } = await axios.get(
      `https://joystreamstats.live/static/survey.json`
    );
    if (!data || data.error) return console.error(`failed to fetch Survey`);
    try {
      console.debug(`survey`, data);
      this.setState({ survey: data.survey });
    } catch (e) {
      console.log(`Failed to load survey: `, e);
    }
    this.setState({ loading: false });
  }

  startSurvey() {
    this.setState({ started: true });
  }
  saveAnswer(event) {
    this.setState({ answers: this.state.answers.concat(+event.target.name) });
  }

  render() {
    const { classes } = this.props;
    const { loading, answers, started, survey } = this.state;

    return (
      <Grid className={classes.root} item lg={12}>
        <Typography variant="h2" className="mb-3">
          <Trans i18nKey="survey.head">Survey</Trans>
        </Typography>
        {!started ? (
          <div>
            {survey.length ? (
              <Button disabled={!survey.length} onClick={this.startSurvey}>
                <Trans i18nKey="survey.start">Start Survey</Trans>
              </Button>
            ) : (
              <Button disabled={loading} onClick={this.loadSurvey}>
                <Trans i18nKey="survey.load">Load Survey</Trans>
              </Button>
            )}
          </div>
        ) : answers.length === survey.length ? (
          <Summary classes={classes} answers={answers} survey={survey} />
        ) : (
          <div>
            <Typography className={classes.heading}>
              {survey[answers.length].question}
            </Typography>

            <div className="d-flex flex-column m-1">
              {survey[answers.length]?.answers.map((answer, index: number) => (
                <Button
                  key={index}
                  name={index}
                  onClick={this.saveAnswer}
                  className="btn-sm m-1 p-1"
                >
                  {answer}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(Survey);

Survey.propTypes = {
  classes: PropTypes.object.isRequired,
};
