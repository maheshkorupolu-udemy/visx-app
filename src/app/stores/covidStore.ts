import {
  observable,
  runInAction,
  makeObservable,
  computed,
  action,
} from "mobx";
import agent from "../api/agent";
import { ICountryStatsHistory } from "../models/countrystathistory";
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
      chartRegion: observable,
      totals: observable,
      getCountryHistoryStats: computed,
      dataForChart: action,
      getTotals: computed,
      getStateOptions: computed,
    });

    this.rootStore = rootStore;
  }
  loadingHistoryStats = false;
  loadingLatestStats = false;
  countryStatHistory: ICountryStatsHistory[] = [];
  countryStatLatest: ICountryStatsHistory | null = null;
  chartData: IStatsHistory[] = [];
  chartRegion: string = "India";
  totals: ITotals | null = null;

  loadcountryStatHistory = async () => {
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
        this.dataForChart("in");
        this.loadingHistoryStats = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingHistoryStats = false;
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

  loadcountryStatLatest = async () => {
    this.loadingLatestStats = true;
    try {
      const result = await agent.covidstatlatest.info();
      const stat = result.data;
      runInAction(() => {
        this.countryStatLatest = {
          countrystat: {
            loc: "india",
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

  get getCountryHistoryStats() {
    const lst = this.countryStatHistory.map((stat) => stat.countrystat);
    return lst.sort((x, y) => +new Date(x.day) - +new Date(y.day));
  }

  dataForChart = (type: string) => {
    if (this.countryStatHistory != null) {
      if (type === "in") {
        this.chartRegion = "India";
        this.chartData = this.countryStatHistory
          .map((stat) => stat.countrystat)
          .sort((x, y) => +new Date(x.day) - +new Date(y.day));
      } else {
        const lst: IStatsHistory[] | any = this.countryStatHistory
          .map((stat) => stat.regional?.filter((x) => x.loc === type))
          .filter(function (ele) {
            return ele?.length! > 0;
          })
          .map((a) => a![0])
          .sort((x, y) => +new Date(x.day) - +new Date(y.day));
        this.chartData = lst;
        this.chartRegion = type;
        this.totals = this.getTotals;
      }
    }
  };

  get getStateOptions() {
    let stateOptions: IOptions[] = [];
    const regions = this.countryStatLatest?.regional?.map((regions) => regions);
    regions?.forEach((region) => {
      stateOptions.push({
        value: region.loc,
        key: region.loc,
        text: region.loc,
      });
    });
    return stateOptions;
  }

  get getTotals() {
    let region = this.chartData;
    let lastIndex = region.length - 1;
    return {
      active: region[lastIndex].active,
      confirmed: region[lastIndex].confirmed,
      discharged: region[lastIndex].discharged,
      deaths: region[lastIndex].deaths,
    };
  }
}
