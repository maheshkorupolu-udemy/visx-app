import { IDistrictInfo } from "./districtinfo";
import { ITotals } from "./totals";

export interface IStateInfo {
  totals: ITotals;
  districts: IDistrictInfo[];
}
