import React from "react";

interface Asset {
  provider: string;
  timestamp: string;
  asset: string;
  speed: {
    dnslookup: number;
    connect: number;
    appconnect: number;
    pretransfer: number;
    redirect: number;
    starttransfer: number;
    total: number;
    size: number;
  };
}

const calculateSpeed = (provider: Asset[]) => {
  let transferred: number = 0;
  let duration: number = 0;
  let assets: string[] = [];
  let url: string;
  provider.forEach(({ speed, provider, asset }: Asset) => {
    const { total, size } = speed;
    transferred += size / 1000000;
    duration += total;
    assets.push(asset);
    url = provider;
  });
  const speed = transferred / duration;
  return { transferred, duration, assets, speed, url };
};

const Ranking = (props: { location: string; providers: any[] }) => {
  const { location, providers } = props;
  const speeds = providers.map((provider) => calculateSpeed(provider));
  const sorted = speeds.sort((a, b) => b.speed - a.speed);
  return (
    <div className="col-3 mb-3">
      <h3>{location}</h3>
      {sorted
        .slice(0, 5)
        .map(({ url, assets, speed, duration, transferred }, i: number) => (
          <div key={url} className="mb-1">
            <b>
              {i + 1}. {url}
            </b>
            <div>speed: {speed.toFixed()} mb/s</div>
            <div>transferred: {transferred.toFixed()} mb</div>
            <div>duration: {duration.toFixed()} s</div>
          </div>
        ))}
    </div>
  );
};
export default Ranking