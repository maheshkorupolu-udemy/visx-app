import {
  observable,
  runInAction,
  makeObservable,
  computed,
  action,
  toJS,
} from "mobx";
import agent from "../api/agent";
import { ICountryStatsHistory } from "../models/countrystathistory";
import { ICovidFilter } from "../models/covidfilter";
import { IOptions } from "../models/options";
import { IStatsHistory } from "../models/statshistory";
import { ITotals } from "../models/totals";
import { RootStore } from "./rootStore";

export default class CovidStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this, {
      loadingHistoryStats: observable,
      loadingLatestStats: observable,
      countryStatHistory: observable,
      countryStatLatest: observable,
      chartData: observable,
      totals: observable,
      dataForChart: action,
      getTotals: computed,
      getStateOptions: computed,
      loadcountryStatHistory: action,
      loadcountryStatLatest: action,
    });

    this.rootStore = rootStore;
  }

  loadingHistoryStats = false;
  loadingLatestStats = false;
  countryStatHistory: ICountryStatsHistory[] = [];
  countryStatLatest: ICountryStatsHistory | null = null;
  chartData: IStatsHistory[] = [];
  totals: ITotals | null = null;
  covidFilter: ICovidFilter = { state: "India", month: 0 };

  loadcountryStatLatest = async () => {
    this.countryStatLatest = null;
    this.loadingLatestStats = true;
    try {
      const result = await agent.covidstatlatest.info();
      const stat = result.data;
      runInAction(() => {
        this.countryStatLatest = {
          countrystat: {
            loc: "India",
            day: stat.day,
            active:
              stat.summary.total -
              (stat.summary.discharged + stat.summary.deaths),
            confirmed: stat.summary.total,
            discharged: stat.summary.discharged,
            deaths: stat.summary.deaths,
          },
          regional: this.getregions(stat),
        };
        this.loadingLatestStats = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingLatestStats = false;
      });
      console.log(error);
    }
  };

  getregions = (info: any) => {
    let stateInfoLst: IStatsHistory[] = [];
    Object.entries(info.regional).forEach(([key, value]) => {
      const stateInfo: any = value;
      let statsHistory: IStatsHistory = {
        loc: stateInfo.loc,
        day: info.day,
        active:
          stateInfo.totalConfirmed - (stateInfo.discharged + stateInfo.deaths),
        confirmed: stateInfo.totalConfirmed,
        discharged: stateInfo.discharged,
        deaths: stateInfo.deaths,
      };
      stateInfoLst.push(statsHistory);
    });
    return stateInfoLst;
  };

  loadcountryStatHistory = async () => {
    if (this.countryStatHistory.length === 0) {
      this.countryStatHistory = [];
      this.loadingHistoryStats = true;
      try {
        const result = await agent.covidstathistory.info();
        const stat = result.data;
        runInAction(() => {
          Object.entries(stat).forEach(([key, value]) => {
            const countryInfo: any = value;
            let countryStat: ICountryStatsHistory = {
              countrystat: {
                loc: "india",
                day: countryInfo.day,
                active:
                  countryInfo.summary.total -
                  (countryInfo.summary.discharged + countryInfo.summary.deaths),
                confirmed: countryInfo.summary.total,
                discharged: countryInfo.summary.discharged,
                deaths: countryInfo.summary.deaths,
              },
              regional: this.getregions(countryInfo),
            };
            this.totals = {
              active:
                countryInfo.summary.total -
                (countryInfo.summary.discharged + countryInfo.summary.deaths),
              confirmed: countryInfo.summary.total,
              discharged: countryInfo.summary.discharged,
              deaths: countryInfo.summary.deaths,
            };
            this.countryStatHistory.push(countryStat);
          });

          this.dataForChart();
          this.loadingHistoryStats = false;
        });
      } catch (error) {
        runInAction(() => {
          this.loadingHistoryStats = false;
        });
        console.log(error);
      }
    }
  };

  dataForChart = () => {
    this.chartData = [];
    if (this.countryStatHistory != null && this.countryStatHistory.length > 0) {
      let lst: IStatsHistory[] = [];
      if (this.covidFilter.state.toLowerCase() === "india") {
        lst = this.countryStatHistory.map((stat) => stat.countrystat);
      } else {
        this.countryStatHistory.forEach((stat) => {
          stat.regional?.forEach((reg) => {
            if (reg.loc === this.covidFilter.state) {
              lst.push(reg);
            }
          });
        });
      }

      if (this.covidFilter.month > 0) {
        lst = lst.filter((stats) => new Date(stats.day).getMonth() + 1 === 8);
      }
      this.chartData = lst.sort((x, y) => +new Date(x.day) - +new Date(y.day));
      this.totals = this.getTotals;
    }
  };

  get getStateOptions() {
    let stateOptions: IOptions[] = [];
    if (this.countryStatLatest != null) {
      const { regional } = this.countryStatLatest;
      regional?.forEach((region) => {
        stateOptions.push({
          value: region.loc,
          key: region.loc,
          text: region.loc,
        });
      });
    }
    return stateOptions;
  }

  get getTotals() {
    let region = this.chartData;
    if (region.length > 0) {
      let lastIndex = region.length - 1;
      return {
        active: region[lastIndex].active,
        confirmed: region[lastIndex].confirmed,
        discharged: region[lastIndex].discharged,
        deaths: region[lastIndex].deaths,
      };
    } else {
      return {
        active: 0,
        confirmed: 0,
        discharged: 0,
        deaths: 0,
      };
    }
  }
}
