import React from "react";
import { observer } from "mobx-react-lite";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ITimeLineData } from "../../../models/timelinedata";

const CovidChart: React.FC<{
  charttype: string;
  chartdata: ITimeLineData[];
}> = ({ charttype, chartdata }) => {
  return (
    <LineChart
      width={600}
      height={300}
      data={chartdata}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="date" />
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

export default CovidChart;
