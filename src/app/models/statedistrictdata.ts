import { IStateInfo } from "./stateinfo";
import { ITotals } from "./totals";

export interface IStateDistrictData {
  keyvalues: object | null;
  totals: ITotals;
  statewise: IStateInfo[];
}
