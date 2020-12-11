import { IDistrictInfo } from "./districtinfo";
import { ITotals } from "./totals";

export interface IStateInfo {
  name: string;
  totals: ITotals;
  districts: IDistrictInfo[];
}
