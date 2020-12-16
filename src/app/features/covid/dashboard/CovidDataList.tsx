import React from "react";
import { Table } from "semantic-ui-react";
import { IStatsHistory } from "../../../models/statshistory";

const CovidDataList: React.FC<{ states: IStatsHistory[] }> = ({ states }) => {
  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>State/UT</Table.HeaderCell>
          <Table.HeaderCell>Confirmed</Table.HeaderCell>
          <Table.HeaderCell>Active</Table.HeaderCell>
          <Table.HeaderCell>Recovered</Table.HeaderCell>
          <Table.HeaderCell>Deceased</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {states != null &&
          states.length > 0 &&
          states.map((state) => (
            <Table.Row key={state.loc}>
              <Table.Cell>{state.loc}</Table.Cell>
              <Table.Cell>{state.confirmed}</Table.Cell>
              <Table.Cell>{state.active}</Table.Cell>
              <Table.Cell>{state.discharged}</Table.Cell>
              <Table.Cell>{state.deaths}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default CovidDataList;
