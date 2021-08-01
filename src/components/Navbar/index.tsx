import { AppBar, Button, createStyles, makeStyles, Toolbar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { MemoryRouter } from 'react-router'
import React from 'react'
import joystream from '../../joystream.svg'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
)

const Navbar = () => {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MemoryRouter>
        <AppBar position='static' style={{ flexDirection: 'row', backgroundColor: '#4138ff', color: '#fff' }}>
          <Toolbar style={{ paddingLeft: '12px', backgroundColor: '#4138ff' }}>
            <Button color='inherit' component={Link} to='/'>
              <img style={{ width: 50, height: 50 }} src={joystream} className='App-logo' alt='Joystream logo' />
            </Button>
            <Button color='secondary' component={Link} to='/validator-report'>Validator Report</Button>
            <Button color='inherit' component={Link} to='/calendar'>Calendar</Button>
            <Button color='inherit' component={Link} to='/curation'>Curation</Button>
            <Button color='inherit' component={Link} to='/timeline'>Timeline</Button>
            <Button color='inherit' component={Link} to='/tokenomics'>Reports</Button>
            <Button color='inherit' component={Link} to='/validators'>Validators</Button>
            <Button color='inherit' component={Link} to='/storage'>Storage</Button>
            <Button color='inherit' component={Link} to='/spending'>Spending</Button>
            <Button color='inherit' component={Link} to='/transactions'>Transfers</Button>
            <Button color='inherit' component={Link} to='/burners'>Top Burners</Button>
            <Button color='inherit' component={Link} to='/mint'>Toolbox</Button>
          </Toolbar>
        </AppBar>
      </MemoryRouter>
    </div>
  )

}