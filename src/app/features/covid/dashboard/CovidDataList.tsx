import React from "react";
import { Table } from "semantic-ui-react";
import { IStateDistrictData } from "../../../models/statedistrictdata";

const CovidDataList: React.FC<{ listData: IStateDistrictData }> = ({
  listData,
}) => {
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
        <Table.Row>
          <Table.Cell>John</Table.Cell>
          <Table.Cell>No Action</Table.Cell>
          <Table.Cell>None</Table.Cell>
          <Table.Cell>John</Table.Cell>
          <Table.Cell>No Action</Table.Cell>
          <Table.Cell>None</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default CovidDataList;
