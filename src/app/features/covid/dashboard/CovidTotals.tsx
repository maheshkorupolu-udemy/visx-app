import React from "react";
import { Divider, Statistic } from "semantic-ui-react";

const CovidTotals: React.FC<{
  confirmed: number;
  active: number;
  recovered: number;
  deceased: number;
}> = ({ confirmed, active, recovered, deceased }) => {
  return (
    <div>
      <Divider hidden />
      <Statistic.Group size="small">
        <Statistic color="grey">
          <Statistic.Value>{confirmed}</Statistic.Value>
          <Statistic.Label>Confirmed</Statistic.Label>
        </Statistic>
        <Statistic color="black">
          <Statistic.Value>{active}</Statistic.Value>
          <Statistic.Label>Active</Statistic.Label>
        </Statistic>
        <Statistic color="green">
          <Statistic.Value>{recovered}</Statistic.Value>
          <Statistic.Label>Recovered</Statistic.Label>
        </Statistic>
        <Statistic color="red">
          <Statistic.Value>{deceased}</Statistic.Value>
          <Statistic.Label>Deceased</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </div>
  );
};

export default CovidTotals;
