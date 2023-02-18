import React, { useEffect, useState } from "react";
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
import { ElectedCouncil } from "@/types";


interface IProps extends IState {}
const Dashboard = (props: IProps) => {
  const { } = props;
  const { data } = useElectedCouncils({});
	const [description1, setDescription1] = useState('');
	const [description2, setDescription2] = useState('');

	const council: ElectedCouncil | undefined = data && data[0]

	useEffect(() => {
		console.log(council)

		if (!council) return

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
          <Memberships council={council}
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
          <Banner title="WG" description={description2}/>
        </Grid>
        <Grid container spacing={3}>
          <Banner title="Proposals" description={description2}/>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
