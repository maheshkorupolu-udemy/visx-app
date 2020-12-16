import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Grid, List, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../layout/LoadingComponent";
import { RootStoreContext } from "../../../stores/rootStore";
import CovidDataList from "./CovidDataList";
import CovidChart from "./CovidChart";
import CovidTotals from "./CovidTotals";

const CovidDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingLatestStats,
    loadcountryStatHistory,
    loadcountryStatLatest,
    countryStatLatest,
  } = rootStore.covidStore;

  useEffect(() => {
    loadcountryStatHistory();
    loadcountryStatLatest();
  }, [loadcountryStatHistory, loadcountryStatLatest]);

  if (loadingLatestStats)
    return <LoadingComponent content="Loading...."></LoadingComponent>;

  return (
    <Segment>
      <Grid>
        <Grid.Column width={8}>
          <CovidTotals
            confirmed={countryStatLatest?.countrystat.confirmed!}
            active={countryStatLatest?.countrystat.active!}
            recovered={countryStatLatest?.countrystat.discharged!}
            deceased={countryStatLatest?.countrystat.deaths!}
          ></CovidTotals>
          <List>
            <CovidDataList states={countryStatLatest?.regional!} />
          </List>
        </Grid.Column>

        <Grid.Column width={8}>
          <Grid.Row>
            <CovidChart charttype={"active"}></CovidChart>
          </Grid.Row>
          <Grid.Row>
            <CovidChart charttype={"discharged"}></CovidChart>
          </Grid.Row>
          <Grid.Row>
            <CovidChart charttype={"deaths"}></CovidChart>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(CovidDashboard);
