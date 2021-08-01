import { getChainState } from './get-status'
import moment from 'moment'
import {
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { BootstrapButton } from './BootstrapButton'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { config } from 'dotenv'
import { Report, Reports } from './Types'
import { ColDef, DataGrid, PageChangeParams, ValueFormatterParams } from '@material-ui/data-grid'
import Alert from '@material-ui/lab/Alert'
import './index.css'

config()

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: '#ffffff',
    },
  }),
)


const ValidatorReport = () => {
  const dateFormat = 'yyyy-MM-DD'
  const [activeValidators, setActiveValidators] = useState([])
  const [lastBlock, setLastBlock] = useState(0)
  const [stash, setStash] = useState('5EhDdcWm4TdqKp1ew1PqtSpoAELmjbZZLm5E34aFoVYkXdRW')
  const [dateFrom, setDateFrom] = useState(moment().subtract(14, 'd').format(dateFormat))
  const [dateTo, setDateTo] = useState(moment().format(dateFormat))
  const [startBlock, setStartBlock] = useState('' as unknown as number)
  const [endBlock, setEndBlock] = useState('' as unknown as number)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [backendUrl] = useState('https://validators.joystreamstats.live')
  const [columns] = useState(
    [
      { field: 'id', headerName: 'Era', width: 150, sortable: true },
      { field: 'stakeTotal', headerName: 'Total Stake', width: 150, sortable: true },
      { field: 'stakeOwn', headerName: 'Own Stake', width: 150, sortable: true },
      { field: 'points', headerName: 'Points', width: 150, sortable: true },
      { field: 'rewards', headerName: 'Rewards', width: 150, sortable: true },
      {
        field: 'commission',
        headerName: 'Commission',
        width: 150,
        sortable: true,
        valueFormatter: (params: ValueFormatterParams) => {
          if (isNaN(params.value as unknown as number)) {
            return `${params.value}%`
          }
          return `${Number(params.value).toFixed(0)}%`
        },
      },
      { field: 'blocksCount', headerName: 'Blocks Produced', width: 150, sortable: true },
    ],
  )
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
  } as unknown as Reports)

  useEffect(() => {
    updateChainState()
    const interval = setInterval(() => {
      updateChainState()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const updateChainState = () => {
    getChainState().then((chainState) => {
      setLastBlock(chainState.finalizedBlockHeight)
      setActiveValidators(chainState.validators.validators)
    })
  }

  const handlePageChange = (params: PageChangeParams) => {
    if (report.totalCount > 0) {
      loadReport(params.page)
    }
  }

  const loadReport = (page: number) => {
    setIsLoading(true)
    const blockParam = startBlock && endBlock ? `&start_block=${startBlock}&end_block=${endBlock}` : ''
    const dateParam = !(startBlock && endBlock) && dateFrom && dateTo ? `&start_time=${moment(dateFrom, dateFormat).format(dateFormat)}&end_time=${moment(dateTo, dateFormat).format(dateFormat)}` : ''
    const apiUrl = `${backendUrl}/validator-report?addr=${stash}&page=${page}${blockParam}${dateParam}`
    axios.get(apiUrl).then((response) => {
      if (response.data.report !== undefined) {
        setReport(response.data)
      }
      setIsLoading(false)
      setError(undefined)
    }).catch((err) => {
      setIsLoading(false)
      setError(err)
    })
  }

  const stopLoadingReport = () => {
    setIsLoading(false)
  }

  const canLoadReport = () => stash && ((startBlock && endBlock) || (dateFrom && dateTo))
  const startOrStopLoading = () => isLoading ? stopLoadingReport() : loadReport(1)
  const updateStartBlock = (e: { target: { value: unknown; }; }) => setStartBlock((e.target.value as unknown as number))
  const updateEndblock = (e: { target: { value: unknown; }; }) => setEndBlock((e.target.value as unknown as number))
  const updateDateFrom = (e: { target: { value: unknown; }; }) => setDateFrom((e.target.value as unknown as string))
  const updateDateTo = (e: { target: { value: unknown; }; }) => setDateTo((e.target.value as unknown as string))

  const getButtonTitle = (isLoading: boolean) => {
    if (isLoading) {
      return (<div style={{ display: 'flex', alignItems: 'center' }}>Stop loading <CircularProgress
        style={{ color: '#fff', height: 20, width: 20, marginLeft: 12 }} /></div>)
    }
    if (startBlock && endBlock) {
      return `Load data between blocks ${startBlock} - ${endBlock}`
    }
    if (dateFrom && dateTo) {
      return `Load data between dates ${dateFrom} - ${dateTo}`
    }
    return 'Choose dates or blocks range'
  }
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Container maxWidth='lg'>
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <h1>Validator Report</h1>
            </div>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Autocomplete
              freeSolo
              style={{ width: '100%' }}
              options={activeValidators}
              onChange={(e, value) => setStash(value || '')}
              value={stash}
              renderInput={(params) => <TextField {...params} label='Validator stash address' variant='filled' />} />
          </Grid>
          <Grid item xs={6} lg={3}>
            <TextField fullWidth type='date' onChange={updateDateFrom} id='block-start'
                       InputLabelProps={{ shrink: true }} label='Date From' value={dateFrom} variant='filled' />
          </Grid>
          <Grid item xs={6} lg={3}>
            <BootstrapButton size='large' style={{ minHeight: 56 }} fullWidth
                             onClick={() => setDateFrom(moment().subtract(2, 'w').format('yyyy-MM-DD'))}>2 weeks from
              today</BootstrapButton>
          </Grid>
          <Grid item xs={6} lg={3}>
            <TextField fullWidth type='date' onChange={updateDateTo} id='block-end' InputLabelProps={{ shrink: true }}
                       label='Date To' value={dateTo} variant='filled' />
          </Grid>
          <Grid item xs={6} lg={3}>
            <BootstrapButton size='large' style={{ minHeight: 56 }} fullWidth
                             onClick={() => setDateTo(moment().format('yyyy-MM-DD'))}>Today</BootstrapButton>
          </Grid>
          <Grid item xs={6} lg={3}>
            <TextField fullWidth type='number' onChange={updateStartBlock} id='block-start' label='Start Block'
                       value={startBlock} variant='filled' />
          </Grid>
          <Grid item xs={6} lg={3}>
            <BootstrapButton size='large' style={{ minHeight: 56 }} fullWidth disabled={!lastBlock}
                             onClick={() => setStartBlock(lastBlock - (600 * 24 * 14))}>{lastBlock ? `2 weeks before latest (${lastBlock - (600 * 24 * 14)})` : '2 weeks from latest'}</BootstrapButton>
          </Grid>
          <Grid item xs={6} lg={3}>
            <TextField fullWidth type='number' onChange={updateEndblock} id='block-end' label='End Block'
                       value={endBlock} variant='filled' />
          </Grid>
          <Grid item xs={6} lg={3}>
            <BootstrapButton size='large' style={{ minHeight: 56 }} fullWidth disabled={!lastBlock}
                             onClick={() => setEndBlock(lastBlock)}>{lastBlock ? `Pick latest block (${lastBlock})` : 'Use latest block'}</BootstrapButton>
          </Grid>
          <Grid item xs={12} lg={12}>
            <BootstrapButton size='large' style={{ minHeight: 56 }} fullWidth disabled={!canLoadReport()}
                             onClick={startOrStopLoading}>{getButtonTitle(isLoading)}</BootstrapButton>
            <Alert style={error !== undefined ? { marginTop: 12 } : { display: 'none' }}
                   onClose={() => setError(undefined)} severity='error'>Error loading validator report, please try
              again.</Alert>
          </Grid>
          <Grid item xs={12} lg={12}>
            <ValidatorReportCard stash={stash} report={report} />
          </Grid>
          <Grid item xs={12} lg={12}>
            <div style={{ height: 600 }}>
              <DataGrid
                rows={report.report}
                columns={columns as unknown as ColDef[]}
                rowCount={report.totalCount}
                paginationMode='server'
                onPageChange={handlePageChange}
                pageSize={report.pageSize}
                rowsPerPageOptions={[]}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

const ValidatorReportCard = (props: { stash: string, report: Reports }) => {
  const copyValidatorStatistics = () => navigator.clipboard.writeText(scoringPeriodText)
  const [scoringPeriodText, setScoringPeriodText] = useState('')
  const useStyles = makeStyles({
    root: {
      minWidth: '100%',
      textAlign: 'left',
      color: '#343a40',
    },
    title: {
      fontSize: 18,
    },
    pos: {
      marginTop: 12,
    },
  })

  const classes = useStyles()

  useEffect(() => {
    updateScoringPeriodText()
  })

  const updateScoringPeriodText = () => {
    if (props.report.report.length > 0) {
      const scoringDateFormat = 'DD-MM-yyyy'
      const report = `Validator Date: ${moment(props.report.startTime).format(scoringDateFormat)} - ${moment(props.report.startTime).format(scoringDateFormat)}\nDescription: I was an active validator from era/block ${props.report.startEra}/${props.report.startBlock} to era/block ${props.report.endEra}/${props.report.endBlock}\nwith stash account ${props.stash}. (I was active in all the eras in this range and found a total of ${props.report.totalBlocks} blocks)`
      setScoringPeriodText(report)
    } else {
      setScoringPeriodText('')
    }
  }

  if (props.report.report.length > 0) {
    return (<Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color='textSecondary' gutterBottom>
          Validator Report:
        </Typography>
        {scoringPeriodText.split('\n').map((i, key) => <Typography key={key} className={classes.pos}
                                                                   color='textSecondary'>{i}</Typography>)}
      </CardContent>
      <CardActions>
        <Button onClick={copyValidatorStatistics} size='small'>Copy to clipboard</Button>
      </CardActions>
    </Card>)
  }
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.pos} color='textSecondary'>
          No Data Available
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ValidatorReport
