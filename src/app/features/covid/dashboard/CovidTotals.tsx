import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Divider, Statistic } from "semantic-ui-react";
import { RootStoreContext } from "../../../stores/rootStore";

const CovidTotals: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { totals } = rootStore.covidStore;
  if (totals == null) return <div>Loading</div>;
  return (
    <div>
      <Divider hidden />
      <Statistic.Group size="small">
        <Statistic color="grey">
          <Statistic.Value>{totals!.confirmed}</Statistic.Value>
          <Statistic.Label>Confirmed</Statistic.Label>
        </Statistic>
        <Statistic color="black">
          <Statistic.Value>{totals!.active}</Statistic.Value>
          <Statistic.Label>Active</Statistic.Label>
        </Statistic>
        <Statistic color="green">
          <Statistic.Value>{totals!.discharged}</Statistic.Value>
          <Statistic.Label>Recovered</Statistic.Label>
        </Statistic>
        <Statistic color="red">
          <Statistic.Value>{totals!.deaths}</Statistic.Value>
          <Statistic.Label>Deceased</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </div>
  );
};
export default observer(CovidTotals);
