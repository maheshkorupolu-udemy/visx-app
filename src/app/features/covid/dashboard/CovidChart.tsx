import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import LoadingComponent from "../../../layout/LoadingComponent";
import { RootStoreContext } from "../../../stores/rootStore";

const CovidChart: React.FC<{
  charttype: string;
}> = ({ charttype }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingHistoryStats,
    loadcountryStatHistory,
    getCountryHistoryStats,
  } = rootStore.covidStore;

  useEffect(() => {
    loadcountryStatHistory();
  }, [loadcountryStatHistory]);

  if (loadingHistoryStats)
    return <LoadingComponent content="Loading...."></LoadingComponent>;

  return (
    <LineChart
      width={600}
      height={300}
      data={getCountryHistoryStats}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="day" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey={charttype}
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
};

export default observer(CovidChart);
