import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import CovidDataList from "./CovidDataList";

const CovidDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadStateDistrictWiseData,
    stateDistrictWiseData,
    loadingIntial,
    getCovid19StateWiseData,
  } = rootStore.covidStore;

  useEffect(() => {
    loadStateDistrictWiseData();
  }, [loadStateDistrictWiseData]);

  if (loadingIntial) return <div>Loading</div>;

  //console.log(getCovid19StateWiseData);
  return <CovidDataList listData={stateDistrictWiseData!} />;
};

export default observer(CovidDashboard);
