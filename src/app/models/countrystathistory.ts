import { IStatsHistory } from "./statshistory";

export interface ICountryStatsHistory {
  countrystat: IStatsHistory;
  regional: IStatsHistory[] | null;
}
