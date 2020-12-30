export interface IStatsHistory {
  loc: string;
  day: Date;
  confirmed: number;
  readonly active: number;
  discharged: number;
  deaths: number;
}
