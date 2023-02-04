import { MapPin } from "react-feather";
import { ResponsiveChoropleth } from "@nivo/geo";
import { features } from "./world_countries.json";
import data from "./data";
import { InfoTooltip } from "../..";

const Pin = (props: { top: numer; left: number; color: string }) => {
  const { top, left, color = "dark" } = props;
  return (
    <InfoTooltip title="">
      <MapPin
        className="position-absolute"
        style={{ top, left, zIndex: 1, color }}
      />
    </InfoTooltip>
  );
};

const Map = (props: { storage: any[]; distribution: any[] }) => {
  const { storage, distribution } = props;
  return (
    <div className="mb-3" style={{ height: "350px" }}>
      {storage.map((b) => (
        //b.operatorMetadata.
        <Pin
          key={b.id}
          top={`150px`}
          left={`250px`}
          color={b.accepting ? "green" : "red"}
        />
      ))}
      {distribution.map((b) => (
        //bucket.operators[0]
        <Pin
          key={b.id}
          top={`150px`}
          left={`250px`}
          color={b.accepting ? "green" : "red"}
        />
      ))}

      <ResponsiveChoropleth
        data={data}
        features={features}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors="nivo"
        domain={[0, 1000000]}
        unknownColor="#666666"
        label="properties.name"
        valueFormat=".2s"
        projectionTranslation={[0.5, 0.5]}
        projectionRotation={[0, 0, 0]}
        enableGraticule={true}
        graticuleLineColor="#dddddd"
        borderWidth={0.5}
        borderColor="#152538"
        legends={[
          {
            anchor: "bottom-left",
            direction: "column",
            justify: true,
            translateX: 20,
            translateY: -100,
            itemsSpacing: 0,
            itemWidth: 94,
            itemHeight: 18,
            itemDirection: "left-to-right",
            itemTextColor: "#444444",
            itemOpacity: 0.85,
            symbolSize: 18,
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000000",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default Map;
