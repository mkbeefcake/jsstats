import React from "react";
import { IState } from "../../types";
import { Container, Grid } from "@material-ui/core";
import Memberships from "./Memberships";
import Channels from "./Channels";
import Videos from "./Videos";
import Forum from "./Forum";
import Election from "./Election";
import Validation from "./Validation";
import SubBlock from "./ui/SubBlock";
import Banner from "./ui/Banner";
import { useElectedCouncils } from '@/hooks';


interface IProps extends IState {}
const Dashboard = (props: IProps) => {
  const { } = props;
  const _description1 = "For a given council period {so there needs to be an input field for this}, I want to see a nice one page dashboard which shows the following, and nothing else (each at end of period)"
  const _description2 = "new tokens minted size of budget at end of period amount of debt at end of period number of workers at end of period"

  const { data } = useElectedCouncils({});
  console.log(data)
  
  return (
    <div style={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Banner description={_description1}/>
        </Grid>
        <Grid container spacing={3}>
          <Memberships
          />
          <Channels
          />
          <Videos
          />
          <Forum
          />
          <Election
          />
          <Validation 
          />
        </Grid>
        <Grid container spacing={3}>
          <Banner title="WG" description={_description2}/>
        </Grid>
        <Grid container spacing={3}>
          <Banner title="Proposals" description={_description2}/>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
