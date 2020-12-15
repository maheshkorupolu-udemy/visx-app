import { RootStoreContext } from "../../../stores/rootStore";
import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../layout/LoadingComponent";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const CovidChart = () => {
    const rootStore = useContext(RootStoreContext);
    const {
      loadTimeLineData,
      loadingTimeLineData,
      timeLineData
    } = rootStore.covidStore;
  
    useEffect(() => {
      loadTimeLineData();
    }, [loadTimeLineData]);
  
    if (loadingTimeLineData)
    return <LoadingComponent content="Loading...."></LoadingComponent>;

    return (
        <LineChart width={600} height={300} data={timeLineData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="date"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="totalconfirmed" stroke="#8884d8" activeDot={{r: 8}}/>
      </LineChart>
    )
}

export default observer(CovidChart);