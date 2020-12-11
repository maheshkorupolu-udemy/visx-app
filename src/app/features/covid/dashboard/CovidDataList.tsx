import React from "react";
import { Table } from "semantic-ui-react";
import { IStateInfo } from "../../../models/stateinfo";

const CovidDataList: React.FC<{ states: IStateInfo[] }> = ({ states }) => {
  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>State/UT</Table.HeaderCell>
          <Table.HeaderCell>Confirmed</Table.HeaderCell>
          <Table.HeaderCell>Active</Table.HeaderCell>
          <Table.HeaderCell>Recovered</Table.HeaderCell>
          <Table.HeaderCell>Deceased</Table.HeaderCell>
          <Table.HeaderCell>Last Updated Time</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {states != null &&
          states.length > 0 &&
          states.map((state) => (
            <Table.Row key={state.name}>
              <Table.Cell>{state.name}</Table.Cell>
              <Table.Cell>{state.totals.confirmed}</Table.Cell>
              <Table.Cell>{state.totals.active}</Table.Cell>
              <Table.Cell>{state.totals.recovered}</Table.Cell>
              <Table.Cell>{state.totals.deaths}</Table.Cell>
              <Table.Cell>{state.totals.lastupdatedtime}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default CovidDataList;
