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
      <Statistic.Group color="red" size="small">
        <Statistic>
          <Statistic.Value>{confirmed}</Statistic.Value>
          <Statistic.Label>Confirmed</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{active}</Statistic.Value>
          <Statistic.Label>Active</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{recovered}</Statistic.Value>
          <Statistic.Label>Recovered</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{deceased}</Statistic.Value>
          <Statistic.Label>Deceased</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </div>
  );
};

export default CovidTotals;
