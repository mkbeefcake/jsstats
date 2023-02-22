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
  const [reports, setReports] = useState(initialState.reports);
  const [validators, setValidators] = useState(initialState.validators);
  const [nominators, setNominators] = useState(initialState.nominators);
  const [stashes, setStashes] = useState(initialState.stashes);
  const [stakes, setStakes] = useState(initialState.stakes);
  const [rewardPoints, setRewardPoints] = useState(initialState.rewardPoints);
  const [blocks, setBlocks] = useState(initialState.blocks);

  const [initialized, setInitialized] = useState(false);

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

  // ----------------------------------------------
  // Loading progress
  // ----------------------------------------------
  const { data } = useElectedCouncils({});

	useEffect(() => {
		if (!data) 
      return

    if (council && council.electionCycleId == data[0].electionCycleId) 
      return

    console.log(`App.ts`, data)
    setCouncil(data[0]) 
	}, [data])

  useEffect(() => {
    loadData();
    joyApi();
  }, [])


  // ----------------------------------------------
  // Joystream Chain API
  // ----------------------------------------------
  const joyApi = () => {
    console.debug(`Connecting to ${wsLocation}`);
    const provider = new WsProvider(wsLocation);

    ApiPromise.create({ provider }).then(async (api) => {
      await api.isReady;
      console.log(`Connected to ${wsLocation}`);
      
      setConnected(true);
      // this.updateWorkingGroups(api);

      api.rpc.chain.subscribeNewHeads(async (header: Header) => {
        const id = header.number.toNumber();

        // period call per 1 min for updates
        const elapsedOneMin = id % 10 === 0;
        if (elapsedOneMin /*|| status.block.id + 10 < id*/) {
          updateStatus(api, id);
        } 

        // if (blocks.find((b) => b.id === id)) 
        //   return;

        // const timestamp = (await api.query.timestamp.now()).toNumber();
        // const duration = status.block
        //   ? timestamp - status.block.timestamp
        //   : 6000;
        // status.block = { id, timestamp, duration };
        // this.save("status", status);

        // blocks = blocks.filter((i) => i.id !== id).concat(status.block);
        // this.setState({ blocks });
      });
    });    
  }

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

  // ---------------------------------------------------
  // Polkadot api functions
  // --------------------------------------------------
  const updateStatus = async (api: ApiPromise, id: number): Promise<any> => {
    console.debug(`#${id}: Updating status`);

    // updateActiveProposals();
    // getMints(api).then((mints) => {
    //   setMints(mints) 
    //   save(`mints`, mints) 
    // });
    // getTokenomics().then((tokenomics) => save(`tokenomics`, tokenomics));

    // let { status, councils } = this.state;
    // status.election = await updateElection(api);
    // if (status.election?.stage) getElectionStatus(api);
    // councils.forEach((c) => {
    //   if (c?.round > status.council) status.council = c;
    // });

    // let hash: string = await api.rpc.chain.getBlockHash(1);
    // if (hash)
    //   status.startTime = (await api.query.timestamp.now.at(hash)).toNumber();

    const nextMemberId = await await api.query.members.nextMemberId();
    // setMembers(nextMemberId - 1);
    setProposals(await get.proposalCount(api));
    setPosts(await get.currentPostId(api));
    setThreads(await get.currentThreadId(api));
    setCategories(await get.currentCategoryId(api));
    // status.proposalPosts = await api.query.proposalsDiscussion.postCount();

    await updateEra(api, status.era).then(async (era) => {
      let _status = {era: 0, lastReward:0, validatorStake: 0}
      _status.era = era;
      _status.lastReward = await getLastReward(api, era);
      _status.validatorStake = await getTotalStake(api, era);
      
      setStatus(_status)
      save("status", _status);

    });

     // return status;
  }  

  const updateEra = async (api: ApiPromise, old: number) => {
    const era = Number(await api.query.staking.currentEra());
    if (era === old) 
      return era;

    // this.updateWorkingGroups(api);
    updateValidatorPoints(api, era);
    
    if (era > status.era || !validators.length) 
      updateValidators(api);

    return era;
  }

  const updateValidatorPoints = async (api: ApiPromise, currentEra: number) => {
    let points = rewardPoints;

    const updateTotal = (eraTotals) => {
      let total = 0;
      Object.keys(eraTotals).forEach((era) => (total += eraTotals[era]));
      return total;
    };

    for (let era = currentEra; era > currentEra - historyDepth; --era) {
      if (era < 0 || (era < currentEra && points.eraTotals[era]))
        continue;

      const eraPoints = await getEraRewardPoints(api, era);
      points.eraTotals[era] = eraPoints.total;
      Object.keys(eraPoints.individual).forEach((validator: string) => {
        if (!points.validators[validator]) points.validators[validator] = {};
        points.validators[validator][era] = eraPoints.individual[validator];
      });
    }

    points.total = updateTotal(points.eraTotals);
    console.debug(`Reward Points: ${points.total} points`);

    setRewardPoints(points);
    save("rewardPoints", points);

  }

  const updateValidators = (api: ApiPromise) => {
    getValidators(api).then((validators) => {
      
      setValidators(validators);
      save("validators", validators);

      getNominators(api).then((nominators) => {
        
        setNominators(nominators);
        save("nominators", nominators);

        getStashes(api).then((stashes) => {
          
          setStashes(stashes);
          save("stashes", stashes);

          const { era } = status;
          getValidatorStakes(api, era, stashes, members, save).then(
            (stakes) => { 
              setStakes(stakes)
              save("stakes", stakes)
            }
          );
        });
      });
    });
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
