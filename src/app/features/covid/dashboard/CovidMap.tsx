import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const INDIA_TOPO_JSON = require("./india.topo.json");

const CovidMap = () => {
  return (
    <ComposableMap>
      <Geographies geography={INDIA_TOPO_JSON}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default CovidMap;
