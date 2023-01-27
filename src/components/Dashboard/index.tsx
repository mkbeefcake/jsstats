import { Container, Grid } from "@material-ui/core";

interface IProps extends IState {
  blocks: { id: number; events: any }[];
}

const data = {
  memberships: { total: 8000, invited: 100, created: 99 },
  channels: { created: 5, total: 10000 },
  videos: { total: 3333, new: 23 },
  nft: { issued: 10, volume: 9123809, platformFee: 23123 },
  forum: { threads: { new: 13, total: 432 }, posts: { new: 99, total: 712 } },
  election: { candidates: 5, staked: 99093123, votes: 232 },
  validation: { count: 100, rewards: 1000, staked: 99999999 },
  minted: { total: 3423432, cm: 3243, funded: 0 },
  proposals: { created: 34, dormant: 6, executed: 8, rejected: 4 },
};

const Dashboard = (props: IProps) => {
  const { save, selectVideo, media, categories } = props;
  const {
    memberships,
    channels,
    videos,
    nft,
    forum,
    election,
    validation,
    minted,
    proposals,
  } = data;
  return (
    <div style={{ flexGrow: 1 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Box wide>
            For a given council period (so there needs to be an input field for
            this), I want to see a nice one page dashboard which shows the
            following, and nothing else (each at end of period)
          </Box>
          <div className="d-flex flex-wrap">
            <Box name="Memberships">
              <Fact name="created" value={memberships.created} />
              <Fact name="created" value={memberships.invited} />
              <Fact name="total" value={memberships.total} />
            </Box>
            <Box name="Channels">
              <Fact name="created" value={channels.created} />
              <Fact name="total" value={channels.total} />
            </Box>
            <Box name="Videos">
              <Fact name="created" value={videos.created} />
              <Fact name="total" value={videos.total} />
            </Box>
            <Box name="NFT">
              <Fact name="isued" value={nft.issued} />
              <Fact name="sale volume" value={nft.volume} />
              <Fact name="total platform fee" value={nft.platformFee} />
            </Box>
            <Box name="Forum">
              <Fact name="threads new" value={forum.threads.new} />
              <Fact name="threads total" value={forum.threads.total} />
              <Fact name="posts new" value={forum.posts.new} />
              <Fact name="posts total" value={forum.posts.total} />
            </Box>
            <Box name="Election">
              <Fact name="candidates" value={election.candidates} />
              <Fact name="votes" value={election.votes} />
              <Fact name="staked" value={election.staked} />
            </Box>
            <Box name="Validation">
              <Fact name="count" value={validation.count} />
              <Fact name="minted" value={validation.rewards} />
              <Fact name="staked" value={validation.staked} />
            </Box>
            <Box name="Minted">
              <Fact name="total" value={minted.total} />
              <Fact name="CM" value={minted.cm} />
              <Fact name="funded" value={minted.funded} />
            </Box>
            <Box name="WG" wide>
              new tokens minted size of budget at end of period amount of debt
              at end of period number of workers at end of period
            </Box>
            <Box name="Proposals" wide>
              <Fact name="created" value={proposals.created} />
              <Fact name="executed" value={proposals.executed} />
              <Fact name="dormant" value={proposals.dormant} />
              <Fact name="rejected" value={proposals.rejected} />
              Proposals: title, creation date, and link to full proposal on
              Pioneer hosted on Joystream.org - created - failed - passed
            </Box>
          </div>
        </Grid>
      </Container>
    </div>
  );
};

const Box = (props: { name: string; children: any; wide?: boolean }) => {
  const { name, children, wide } = props;
  const width = wide ? "w-100" : "w-25";
  const style = wide ? null : { minHeight: "20vh" };
  return (
    <div className={`p-1 10vt ${width}`}>
      <div className="bg-primary m-1 p-3" style={style}>
        <h2>{name}</h2>
        {children}
      </div>
    </div>
  );
};

const Fact = (props: { name: string; value: number }) => {
  const { name, value } = props;
  return (
    <>
      <div className="float-right">{value}</div>{" "}
      <div className="font-weight-bold">{name}</div>
    </>
  );
};

export default Dashboard;
