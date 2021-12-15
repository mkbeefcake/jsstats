interface Asset {}

const getVideosPerProvider = (assets: Asset[]) => {
  const providers = {};
  assets.forEach((a) => {
    if (!a.mediaDataObject?.liaison) return;
    const liaison = a.mediaDataObject.liaison;
    const worker = liaison.workerId;

    if (!providers[worker])
      providers[worker] = { first: a.createdAt, ...liaison, videos: [] };

    providers[worker].videos.push(a);

    if (providers[worker].first > a.createdAt)
      providers[worker].first = a.createdAt;
  });

  const lastProviderAdded = Object.values(providers).reduce(
    (max, provider) => (max > provider.first ? max : provider.first),
    Object.values(providers)[0].first
  );

  return Object.values(providers)
    .map((p) => {
      const recent = p.videos.filter(
        (v) => v.createdAt > lastProviderAdded
      ).length;
      return { ...p, recent };
    })
    .sort((a, b) => b.recent - a.recent);
};

const Liasons = (props: { assets: Asset[] }) => {
  const { assets } = props;
  if (!assets.length) return <div />;
  return (
    <div className="m-0">
      <h3 className="text-center">Liaisons per Worker</h3>
      <div className="d-flex flex-column m-0">
        <div className="d-flex flex-row">
          <div className="col-1 text-right">Worker</div>
          <div className="col-6 text-left">Metadata</div>
          <div className="col-1 text-right">Videos</div>
          <div className="col-2">First Liaison</div>
          <div className="col-1" title="Since Last Provider Added">
            Recent
          </div>
          <div className="col-1 d-none d-md-block text-right">Pending</div>
        </div>
        {getVideosPerProvider(assets).map(
          ({ recent, first, workerId, metadata, videos }) => (
            <div key={workerId} className="d-flex flex-row m-0">
              <div className="col-1 text-right">{workerId}</div>
              <div className="col-6 text-left">{metadata}</div>
              <div className="col-1 text-right">{videos.length}</div>
              <div className="col-2">{first.split("T")[0]}</div>
              <div className="col-1">{recent}</div>
              <div className="col-1 d-none d-md-block text-right ">
                {
                  videos.filter(
                    (v) => v.mediaDataObject.liaisonJudgement !== "ACCEPTED"
                  ).length
                }
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Liasons;
