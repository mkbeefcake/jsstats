import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Modals, Routes, Loading, Footer, Status } from "./components";

import * as get from "./lib/getters";
import { bootstrap, getTokenomics, queryJstats } from "./lib/queries";
import { getMints, updateOpenings, updateWorkers } from "./lib/groups";
import {
  updateElection,
  getCouncilApplicants,
  getCouncilSize,
  getVotes,
} from "./lib/election";
import {
  getStashes,
  getNominators,
  getValidators,
  getValidatorStakes,
  getEraRewardPoints,
  getLastReward,
  getTotalStake,
} from "./lib/validators";
import { apiLocation, wsLocation, historyDepth } from "./config";
import { initialState } from "./state";
import axios from "axios";

import { useElectedCouncils } from '@/hooks';
import { ElectedCouncil } from "@/types";

// types
// import { Api, IState } from "./types";
// import { types } from "@joystream/types";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Header } from "@polkadot/types/interfaces";

const App = (props: {}) => {

  const [stars, setStars] = useState(initialState.stars);
  const [editKpi, setEditKpi] = useState(initialState.editKpi);
  const [showStatus, setShowStatus] = useState(initialState.showStatus);
  const [hideFooter, setHideFooter] = useState(initialState.hideFooter);
  const [members, setMembers] = useState(initialState.members);
  const [connected, setConnected] = useState(initialState.connected);
  const [fetching, setFetching] = useState(initialState.fetching);
  const [status, setStatus] = useState(initialState.status);
  const [assets, setAssets] = useState(initialState.assets);
  const [providers, setProviders] = useState(initialState.providers);
  const [councils, setCouncils] = useState(initialState.councils);
  const [council, setCouncil] = useState<ElectedCouncil | undefined>(undefined);
  const [election, setElection] = useState(initialState.election);
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState(initialState.categories);
  const [channels, setChannels] = useState(initialState.channels);
  const [proposals, setProposals] = useState(initialState.proposals);
  const [posts, setPosts] = useState(initialState.posts);
  const [threads, setThreads] = useState(initialState.threads);
  const [mints, setMints] = useState(initialState.mints);
  const [openings, setOpenings] = useState(initialState.openings);
  const [tokenomics, setTokenomics] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [reports, setReports] = useState({});
  const [validators, setValidators] = useState({});
  const [nominators, setNominators] = useState([]);
  const [stashes, setStashes] = useState([]);
  const [stakes, setStakes] = useState({});
  const [rewardPoints, setRewardPoints] = useState({});

  const childProps = {
    stars,
    editKpi,
    showStatus,
    hideFooter,
    members,
    connected,
    fetching,
    status,
    assets,
    providers,    
    councils,
    council,
    election,
    workers,
    categories,
    channels,
    proposals,
    posts,
    threads,
    mints,
    openings,
    tokenomics,
    transactions,
    reports,
    validators,
    nominators,
    stashes,
    stakes,
    rewardPoints
  }

  // Loading process
  const { data } = useElectedCouncils({});

	useEffect(() => {
		if (!data) 
      return

    if (council && council.electionCycleId == data[0].electionCycleId) 
      return

    console.log(`App.ts`, data)
    setCouncil(data[0]) 
	}, [data])

  // useEffect(() => {
  //   loadData();
  // }, [])

  const loadData = async () => {
    console.debug(`Loading data`)
    setStars(load("stars"))
    setEditKpi(load("editKpi"))
    setShowStatus(load("showStatus"))
    setHideFooter(load("hideFooter"))
    setMembers(load("members"))
    setConnected(load("connected"))
    setFetching(load("fetching"))
    setStatus(load("status"))
    setAssets(load("assets"))
    setProviders(load("providers"))
    setCouncils(load("councils"))
    setCouncil(load("council"))
    setElection(load("election"))
    setWorkers(load("workers"))
    setCategories(load("categories"))
    setChannels(load("channels"))
    setProposals(load("proposals"))
    setPosts(load("posts"))
    setThreads(load("threads"))
    setMints(load("mints"))
    setOpenings(load("openings"))
    setTokenomics(load("tokenomics"))
    setTransactions(load("transactions"))
    setReports(load("reports"))
    setValidators(load("validators"))
    setNominators(load("nominators"))
    setStashes(load("stashes"))
    setStakes(load("stakes"))
    setRewardPoints(load("rewardPoints"))

    // getTokenomics().then((tokenomics) => this.save(`tokenomics`, tokenomics));
    // bootstrap(this.save); // axios requests
    // this.updateCouncils();
  }

  // Save & Load data to local storage
  const save = (key: string, data: any) => {
    const value = JSON.stringify(data);
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      const size = value.length / 1024;
      console.warn(`Failed to save ${key} (${size.toFixed()} KB)`, e.message);
    }
    return data;
  }

  const load = (key: string) => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return;
      const size = data.length;
      if (size > 10240)
        console.debug(` -${key}: ${(size / 1024).toFixed(1)} KB`);

      return JSON.parse(data);
    } catch (e) {
      console.warn(`Failed to load ${key}`, e);
    }
  }  

  // Trigger functions
  const toggleStar = (account: string) => {
    let temp = stars;  
    temp[account] = !temp[account];
    setStars(temp);
    save("stars", temp);
  }

  const toggleEditKpi = (_editKpi: boolean) => {
    setEditKpi(_editKpi);
  }

  const toggleShowStatus = () => {
    setShowStatus(!showStatus);
  }
  
  const toggleFooter = () => {
    setHideFooter(!hideFooter);
  }

  const getMember = (handle: string) => {    
    const member = members.find((m) => m.handle === handle);
    if (member) return member;
    return members.find((m) => m.rootKey === handle);
  }

  // const { connected, fetching, loading, hideFooter } = this.state;
  // if (loading) 
  //   return <Loading />;

  return (
    <>
      <Routes
        toggleEditKpi={toggleEditKpi}
        toggleFooter={toggleFooter}
        toggleStar={toggleStar}
        getMember={getMember}
        {...childProps}
      />

      <Modals
        toggleEditKpi={toggleEditKpi}
        toggleShowStatus={toggleShowStatus}
        {...childProps}
      />

      <Footer show={!hideFooter} toggleHide={toggleFooter} />

      <Status
        toggleShowStatus={toggleShowStatus}
        connected={connected}
        fetching={fetching}
      />
    </>
  );


}

export default App;
