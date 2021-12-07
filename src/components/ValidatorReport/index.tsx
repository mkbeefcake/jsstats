import moment from "moment";
import {
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Tab,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { BootstrapButton } from "./BootstrapButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import axios from "axios";
import { config } from "dotenv";
import { Report, Reports, StaticEraStats, ValidatorsJSResponse } from "./Types";
import { DataGrid, GridColumns } from "@material-ui/data-grid";
import Alert from "@material-ui/lab/Alert";
import Tabs from "@material-ui/core/Tabs";
import Backdrop from "@material-ui/core/Backdrop";
import "./index.css";
import pako from "pako";
import { alternativeBackendApis } from "../../config";

config();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "#ffffff",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    tableWrapper: {
      height: 400,
      position: "relative",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
      position: "absolute",
      width: "100%",
    },
  })
);

const oldChainStatsFileName = "validators-old-testnet.json.gz";
const oldChainStatsLocation = `https://joystreamstats.live/static/${oldChainStatsFileName}`;

const ValidatorReport = (props: {}) => {
  const { lastBlock = 0, validators } = props;
  const dateFormat = "yyyy-MM-DD";
  const [oldChainLastDate, setOldChainLastDate] = useState(moment());
  const [oldChainPageSize, setOldChainPageSize] = useState(50);
  const chains = ["Chain 4 - Babylon", "Chain 5 - Antioch"];
  const [chain, setChain] = useState(chains[1]);
  const [stash, setStash] = useState(
    "5EhDdcWm4TdqKp1ew1PqtSpoAELmjbZZLm5E34aFoVYkXdRW"
  );
  const [dateFrom, setDateFrom] = useState(
    moment().subtract(14, "d").format(dateFormat)
  );
  const [dateTo, setDateTo] = useState(moment().format(dateFormat));
  const [startBlock, setStartBlock] = useState("" as unknown as number);
  const [endBlock, setEndBlock] = useState("" as unknown as number);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [backendUrl] = useState(alternativeBackendApis);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTab, setFilterTab] = useState(0 as number);
  const [oldChainStats, setOldChainStats] = useState({
    blocksFound: [],
    eraStats: [],
  } as ValidatorsJSResponse);
  const [oldChainRows, setOldChainRows] = useState([] as StaticEraStats[]);
  const [oldChainColumns] = useState([
    { field: "id", headerName: "Era", width: 150, sortable: true },
    {
      field: "timestampEnded",
      headerName: "End Date",
      width: 200,
      sortable: true,
      valueFormatter: (params: { value: number }) => {
        return moment(params.value).format(dateFormat);
      },
    },
    {
      field: "timestampStarted",
      headerName: "Start Date",
      width: 200,
      sortable: true,
      valueFormatter: (params: { value: number }) => {
        return moment(params.value).format(dateFormat);
      },
    },
    {
      field: "startHeight",
      headerName: "Start Block",
      width: 200,
      sortable: true,
    },
    { field: "endHeight", headerName: "End Block", width: 150, sortable: true },
    {
      field: "totalPoints",
      headerName: "Total Points",
      width: 200,
      sortable: true,
    },
  ]);
  const [columns] = useState([
    { field: "id", headerName: "Era", width: 150, sortable: true },
    {
      field: "stakeTotal",
      headerName: "Total Stake",
      width: 150,
      sortable: true,
    },
    { field: "stakeOwn", headerName: "Own Stake", width: 150, sortable: true },
    { field: "points", headerName: "Points", width: 150, sortable: true },
    { field: "rewards", headerName: "Rewards", width: 150, sortable: true },
    {
      field: "commission",
      headerName: "Commission",
      width: 200,
      sortable: true,
      valueFormatter: (params: { value: number }) => {
        if (isNaN(params.value)) {
          return `${params.value}%`;
        }
        return `${Number(params.value).toFixed(0)}%`;
      },
    },
    {
      field: "blocksCount",
      headerName: "Blocks Produced",
      width: 200,
      sortable: true,
    },
  ]);
  const [report, setReport] = useState({
    pageSize: 0,
    totalCount: 0,
    totalBlocks: 0,
    startEra: -1,
    endEra: -1,
    startBlock: -1,
    endBlock: -1,
    startTime: -1,
    endTime: -1,
    report: [] as unknown as Report[],
  } as unknown as Reports);

  const isDateRange = filterTab === 0;
  const isBlockRange = filterTab === 1;
  const isOldChain = chain === chains[0];

  const updateOldChainRows = () => {
    if (stash) {
      const author = oldChainStats.blocksFound.filter(
        (b) => b.author === stash
      );
      if (author.length > 0) {
        const activeEras = author[0].activeEras;
        const authorStats = oldChainStats.eraStats
          .filter((s) => activeEras.indexOf(s.eraNumber) > -1)
          .filter((s) => {
            if (isDateRange) {
              const isAfter = moment(s.timestampStarted).isAfter(
                moment(dateFrom, dateFormat).startOf("d")
              );
              const isBefore = moment(s.timestampStarted).isBefore(
                moment(dateTo, dateFormat).endOf("d")
              );
              return isAfter && isBefore;
            } else {
              return s.startHeight >= startBlock && s.endHeight <= endBlock;
            }
          });
        const filteredStats = authorStats.map((s) => {
          return {
            id: s.eraNumber,
            startHeight: s.startHeight,
            endHeight: s.endHeight,
            timestampStarted: s.timestampStarted,
            timestampEnded: s.timestampEnded,
            totalPoints: s.totalPoints,
          };
        });
        setOldChainRows(filteredStats);
        setError(undefined);
        return;
      }
    }
    setOldChainRows([]);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(oldChainStatsLocation, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        try {
          const binData = new Uint8Array(response.data);
          const decompressedData = pako.inflate(binData);
          updateOldChainStats(new TextDecoder().decode(decompressedData));
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          console.log(err);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  }, []);

  const updateOldChainStats = (stringData: string) => {
    const oldStats = JSON.parse(stringData);
    setOldChainStats(oldStats as ValidatorsJSResponse);
    setOldChainLastDate(
      moment(oldStats.eraStats[oldStats.eraStats.length - 1].timestampEnded)
    );
  };

  const handlePageChange = (page: number) => {
    if (report.totalCount > 0) {
      loadReport(page);
    }
  };

  const loadReport = (page: number) => {
    if (isOldChain) {
      updateOldChainRows();
      return;
    }
    setCurrentPage(page);
    setIsLoading(true);
    const blockParam =
      isBlockRange && startBlock && endBlock
        ? `&start_block=${startBlock}&end_block=${endBlock}`
        : "";
    const dateParam =
      isDateRange && dateFrom && dateTo
        ? `&start_time=${moment(dateFrom, dateFormat).format(
            dateFormat
          )}&end_time=${moment(dateTo, dateFormat).format(dateFormat)}`
        : "";
    const apiUrl = `${backendUrl}/validator-report?addr=${stash}&page=${page}${blockParam}${dateParam}`;
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.data.report !== undefined) {
          setReport(response.data);
        }
        setIsLoading(false);
        setError(undefined);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  };

  const stopLoadingReport = () => {
    setIsLoading(false);
  };

  const canLoadReport = () =>
    stash &&
    ((isBlockRange && startBlock && endBlock) ||
      (isDateRange && dateFrom && dateTo));
  const startOrStopLoading = () =>
    isLoading ? stopLoadingReport() : loadReport(1);
  const updateStartBlock = (e: { target: { value: unknown } }) =>
    setStartBlock(e.target.value as unknown as number);
  const updateEndBlock = (e: { target: { value: unknown } }) =>
    setEndBlock(e.target.value as unknown as number);
  const updateDateFrom = (e: { target: { value: unknown } }) =>
    setDateFrom(e.target.value as unknown as string);
  const updateDateTo = (e: { target: { value: unknown } }) =>
    setDateTo(e.target.value as unknown as string);

  const setCurrentPeriodStartBlock = () => {
    const blocksToEndOfDay = moment().endOf("d").diff(moment(), "seconds") / 6;
    const twoWeeksBlocks = 600 * 24 * 14;
    return setStartBlock(
      lastBlock - twoWeeksBlocks - Number(blocksToEndOfDay.toFixed(0))
    );
  };

  const setCurrentPeriodEndBlock = () => setEndBlock(lastBlock);

  const getButtonTitle = (isLoading: boolean) => {
    if (isLoading) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          Stop loading{" "}
          <CircularProgress
            style={{ color: "#fff", height: 20, width: 20, marginLeft: 12 }}
          />
        </div>
      );
    }
    if (isBlockRange) {
      return startBlock && endBlock
        ? `Load data between blocks ${startBlock} - ${endBlock}`
        : "Load data between blocks";
    }
    if (isDateRange) {
      return dateFrom && dateTo
        ? `Load data between dates ${dateFrom} - ${dateTo}`
        : "Load data between dates";
    }
    return "Choose dates or blocks range";
  };
  const updateStash = (event: ChangeEvent<{}>, value: string | null) => {
    setStash(value || "");
  };

  const updateChain = (event: ChangeEvent<{ value: unknown }>) => {
    setChain(event.target.value as string);
    if ((event.target.value as string) === chains[0]) {
      // set date range to last date of old chain date
      setDateTo(oldChainLastDate.format(dateFormat));
      setDateFrom(oldChainLastDate.subtract(14, "d").format(dateFormat));
    } else {
      setDateTo(moment().format(dateFormat));
      setDateFrom(moment().subtract(14, "d").format(dateFormat));
    }
  };

  const updateStashOnBlur = (
    event: FocusEvent<HTMLDivElement> & { target: HTMLInputElement }
  ) => {
    setStash((prev) =>
      prev !== event.target.value ? event.target.value : prev
    );
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <h1>Validator Report</h1>
            </div>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Autocomplete
              freeSolo
              style={{ width: "100%" }}
              options={validators}
              onChange={updateStash}
              onBlur={updateStashOnBlur}
              value={stash}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Validator stash address"
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="chain-label">Chain</InputLabel>
              <Select
                style={{ width: "100%" }}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={chain}
                onChange={updateChain}
                label="Age"
              >
                <MenuItem value={chains[0]}>{chains[0]}</MenuItem>
                <MenuItem value={chains[1]}>{chains[1]}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Tabs
              indicatorColor="primary"
              value={filterTab}
              onChange={(e: unknown, newValue: number) =>
                setFilterTab(newValue)
              }
              aria-label="simple tabs example"
            >
              <Tab label="Search by date" />
              <Tab label="Search by blocks" />
            </Tabs>
          </Grid>
          <Grid hidden={!isDateRange} item xs={6} lg={3}>
            <TextField
              fullWidth
              type="date"
              onChange={updateDateFrom}
              id="block-start"
              InputLabelProps={{ shrink: true }}
              label="Date From"
              value={dateFrom}
              variant="filled"
            />
          </Grid>
          <Grid hidden={!isDateRange} item xs={6} lg={3}>
            <BootstrapButton
              size="large"
              style={{ height: 56 }}
              fullWidth
              onClick={() =>
                setDateFrom(moment().subtract(2, "w").format("yyyy-MM-DD"))
              }
            >
              2 weeks from today
            </BootstrapButton>
          </Grid>
          <Grid hidden={!isDateRange} item xs={6} lg={3}>
            <TextField
              fullWidth
              type="date"
              onChange={updateDateTo}
              id="block-end"
              InputLabelProps={{ shrink: true }}
              label="Date To"
              value={dateTo}
              variant="filled"
            />
          </Grid>
          <Grid hidden={!isDateRange} item xs={6} lg={3}>
            <BootstrapButton
              size="large"
              style={{ height: 56 }}
              fullWidth
              onClick={() => setDateTo(moment().format("yyyy-MM-DD"))}
            >
              Today
            </BootstrapButton>
          </Grid>
          <Grid hidden={!isBlockRange} item xs={6} lg={3}>
            <TextField
              fullWidth
              type="number"
              onChange={updateStartBlock}
              id="block-start"
              label="Start Block"
              value={startBlock}
              variant="filled"
            />
          </Grid>
          <Grid hidden={!isBlockRange} item xs={6} lg={3}>
            <BootstrapButton
              size="large"
              style={{ height: 56 }}
              fullWidth
              disabled={!lastBlock}
              onClick={setCurrentPeriodStartBlock}
            >
              {lastBlock
                ? `2 weeks before latest (${lastBlock - 600 * 24 * 14})`
                : "2 weeks from latest"}
            </BootstrapButton>
          </Grid>
          <Grid hidden={!isBlockRange} item xs={6} lg={3}>
            <TextField
              fullWidth
              type="number"
              onChange={updateEndBlock}
              id="block-end"
              label="End Block"
              value={endBlock}
              variant="filled"
            />
          </Grid>
          <Grid hidden={!isBlockRange} item xs={6} lg={3}>
            <BootstrapButton
              size="large"
              style={{ height: 56 }}
              fullWidth
              disabled={!lastBlock}
              onClick={setCurrentPeriodEndBlock}
            >
              {lastBlock
                ? `Pick latest block (${lastBlock})`
                : "Use latest block"}
            </BootstrapButton>
          </Grid>
          <Grid item xs={12} lg={12}>
            <BootstrapButton
              size="large"
              style={{ height: 56 }}
              fullWidth
              disabled={!canLoadReport()}
              onClick={startOrStopLoading}
            >
              {getButtonTitle(isLoading)}
            </BootstrapButton>
            <Alert
              style={
                error !== undefined ? { marginTop: 12 } : { display: "none" }
              }
              onClose={() => setError(undefined)}
              severity="error"
            >
              Error loading validator report, please try again.
            </Alert>
          </Grid>
          {!isOldChain && (
            <Grid item xs={12} lg={12}>
              <ValidatorReportCard stash={stash} report={report} />
            </Grid>
          )}
          <Grid item xs={12} lg={12}>
            <div className={classes.tableWrapper}>
              <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              {isOldChain && (
                <DataGrid
                  rows={oldChainRows}
                  columns={oldChainColumns as unknown as GridColumns}
                  pageSize={oldChainPageSize}
                  onPageSizeChange={(pageSize) => setOldChainPageSize(pageSize)}
                  pagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  disableSelectionOnClick
                />
              )}
              {!isOldChain && (
                <DataGrid
                  rows={report.report}
                  columns={columns as unknown as GridColumns}
                  rowCount={report.totalCount}
                  pagination
                  paginationMode="server"
                  onPageChange={handlePageChange}
                  pageSize={report.pageSize}
                  rowsPerPageOptions={[0, 50]}
                  disableSelectionOnClick
                  page={currentPage}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

const ValidatorReportCard = (props: { stash: string; report: Reports }) => {
  const copyValidatorStatistics = () =>
    navigator.clipboard.writeText(scoringPeriodText);
  const [scoringPeriodText, setScoringPeriodText] = useState("");
  const useStyles = makeStyles({
    root: {
      minWidth: "100%",
      textAlign: "left",
    },
    title: {
      fontSize: 18,
    },
    pos: {
      marginTop: 12,
    },
  });

  const classes = useStyles();

  useEffect(() => {
    updateScoringPeriodText();
  });

  const updateScoringPeriodText = () => {
    if (props.report.report.length > 0) {
      const scoringDateFormat = "DD-MM-yyyy";
      const report = `Validator Date: ${moment(props.report.startTime).format(
        scoringDateFormat
      )} - ${moment(props.report.endTime).format(
        scoringDateFormat
      )}\nDescription: I was an active validator from era/block ${
        props.report.startEra
      }/${props.report.startBlock} to era/block ${props.report.endEra}/${
        props.report.endBlock
      }\nwith stash account ${
        props.stash
      }. (I was active in all the eras in this range and found a total of ${
        props.report.totalBlocks
      } blocks)`;
      setScoringPeriodText(report);
    } else {
      setScoringPeriodText("");
    }
  };

  if (props.report.report.length > 0) {
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textPrimary"
            gutterBottom
          >
            Validator Report:
          </Typography>
          {scoringPeriodText.split("\n").map((i, key) => (
            <Typography key={key} className={classes.pos} color="textSecondary">
              {i}
            </Typography>
          ))}
        </CardContent>
        <CardActions>
          <Button onClick={copyValidatorStatistics} size="small">
            Copy to clipboard
          </Button>
        </CardActions>
      </Card>
    );
  }
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.pos} color="textSecondary">
          No Data Available
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ValidatorReport;
