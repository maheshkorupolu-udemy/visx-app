import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Grid, List, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../layout/LoadingComponent";
import { RootStoreContext } from "../../../stores/rootStore";
import CovidDataList from "./CovidDataList";
import CovidChart from "./CovidChart";

const CovidDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadStateDistrictWiseData,
    loadingIntial,
    getCovid19StateWiseData,
    loadTimeLineData,
    loadingTimeLineData,
    timeLineData,
    loadcountryStatHistory,
  } = rootStore.covidStore;

  useEffect(() => {
    loadcountryStatHistory();
    loadStateDistrictWiseData();
    loadTimeLineData();
  }, [loadStateDistrictWiseData, loadTimeLineData]);

  if (loadingIntial && loadingTimeLineData)
    return <LoadingComponent content="Loading...."></LoadingComponent>;

  return (
    <Segment>
      <Grid>
        <Grid.Column width={8}>
          <List>
            <CovidDataList states={getCovid19StateWiseData!} />
          </List>
        </Grid.Column>
        <Grid.Column width={8}>
          <Grid.Row>
            <CovidChart
              charttype={"totalconfirmed"}
              chartdata={timeLineData}
            ></CovidChart>
          </Grid.Row>
          <Grid.Row>
            <CovidChart
              charttype={"totaldeceased"}
              chartdata={timeLineData}
            ></CovidChart>
          </Grid.Row>
          <Grid.Row>
            <CovidChart
              charttype={"totalrecovered"}
              chartdata={timeLineData}
            ></CovidChart>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(CovidDashboard);
