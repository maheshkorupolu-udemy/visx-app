import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import {
  Container,
  Grid,
  List,
  Segment,
  Header,
  Select,
  Divider,
} from "semantic-ui-react";
import LoadingComponent from "../../../layout/LoadingComponent";
import { RootStoreContext } from "../../../stores/rootStore";
import CovidDataList from "./CovidDataList";
import CovidChart from "./CovidChart";
import CovidTotals from "./CovidTotals";
import Moment from "react-moment";

const CovidDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingLatestStats,
    loadcountryStatHistory,
    loadcountryStatLatest,
    countryStatLatest,
    chartRegion,
    getStateOptions,
    dataForChart,
    covidFilter,
    monthOptions,
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
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
              <Container text textAlign="center">
                <Header as="h2">COVID-19 CORONAVIRUS PANDEMIC INDIA</Header>
              </Container>
              <Container text textAlign="center">
                <Header as="h4">
                  Last updated:{" "}
                  <Moment format="MMMM Do YYYY, h:mm:ss a">{new Date()}</Moment>
                </Header>
              </Container>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <CovidTotals></CovidTotals>
          </Grid.Column>
          <Grid.Column width={8}>
            <Divider hidden={true}></Divider>
            <Select
              placeholder="Select state"
              options={getStateOptions}
              onChange={(e, data) => {
                covidFilter.state = data.value as string;
                dataForChart();
              }}
            />
            <Select
              placeholder="Select month"
              options={monthOptions}
              onChange={(e, data) => {
                covidFilter.month = data.value as number;
                dataForChart();
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <List>
              <CovidDataList states={countryStatLatest?.regional!} />
            </List>
          </Grid.Column>

          <Grid.Column width={8}>
            <Grid.Row>
              <Grid.Column>
                <Container text textAlign="center">
                  <Header as="h4">{chartRegion}</Header>
                </Container>
              </Grid.Column>
            </Grid.Row>
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
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default observer(CovidDashboard);
