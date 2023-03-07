import React, { useEffect, useState } from "react";
import { IState } from "../../types";
import { Container, Grid } from "@material-ui/core";
import Memberships from "./Memberships";
import Channels from "./Channels";
import Videos from "./Videos";
import Forum from "./Forum";
import Election from "./Election";
import Validation from "./Validation";
import WorkGroup from './Workgroup';

import Banner from "../ui/Banner";
import { useElectedCouncils } from '@/hooks';
import { ElectedCouncil } from "@/graphtypes";
import Proposals from "./Proposals";


const Dashboard = (props) => {
  const { } = props;
  const { data } = useElectedCouncils({});
	const [description1, setDescription1] = useState('');

	const council: ElectedCouncil | undefined = data && data[0]

	useEffect(() => {
		if (!council) 
      return

		setDescription1(
			"Round: " + council.electionCycleId + 
			", From: " + new Date(council.electedAt.timestamp) + 
			", Councilors: [ " + council.councilors.map(each => each.member.handle).join(", ") + " ]")

	}, [council])
 

  return (
    <div style={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Banner description={description1}/>
        </Grid>
        <Grid container spacing={3}>
          <Memberships council={council}/>
          <Channels council={council}/>
          <Videos council={council}/>
          <Forum council={council}/>
          <Election council={council}/>  
          <Validation council={council}/>
        </Grid>
        <Grid container spacing={3}>
          <WorkGroup council={council}/>
          <Proposals council={council} />
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
