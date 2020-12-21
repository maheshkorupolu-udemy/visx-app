import {
  observable,
  runInAction,
  makeObservable,
  computed,
  action,
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
      chartRegion: observable,
      totals: observable,
      getCountryHistoryStats: computed,
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
  chartRegion: string = "India";
  totals: ITotals | null = null;
  covidFilter: ICovidFilter = { state: "India", month: 0 };
  monthOptions: IOptions[] = [
    { key: "0", text: "Select month", value: "0" },
    { key: "1", text: "January", value: "1" },
    { key: "2", text: "February", value: "2" },
    { key: "3", text: "March", value: "3" },
    { key: "4", text: "April", value: "4" },
    { key: "5", text: "May", value: "5" },
    { key: "6", text: "June", value: "6" },
    { key: "7", text: "July", value: "7" },
    { key: "8", text: "August", value: "8" },
    { key: "9", text: "September", value: "9" },
    { key: "10", text: "October", value: "10" },
    { key: "11", text: "November", value: "11" },
    { key: "12", text: "December", value: "12" },
  ];

  loadcountryStatHistory = async () => {
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

  get getCountryHistoryStats() {
    const lst = this.countryStatHistory.map((stat) => stat.countrystat);
    return lst.sort((x, y) => +new Date(x.day) - +new Date(y.day));
  }

  dataForChart = () => {
    this.chartData = [];
    if (this.countryStatHistory != null) {
      if (this.covidFilter.state === "India") {
        this.chartRegion = "India";
        this.chartData = this.countryStatHistory
          .map((stat) => stat.countrystat)
          .sort((x, y) => +new Date(x.day) - +new Date(y.day));
      } else {
        const lst: IStatsHistory[] | any = this.countryStatHistory
          .map((stat) =>
            stat.regional?.filter((x) => x.loc === this.covidFilter.state)
          )
          .filter(function (ele) {
            return ele?.length! > 0;
          })
          .map((a) => a![0])
          .sort((x, y) => +new Date(x.day) - +new Date(y.day));

        this.chartData = lst;
      }

      if (this.covidFilter.month > 0) {
        this.chartData = this.chartData.filter(
          (stats) => new Date(stats.day).getMonth() + 1 === 8
        );
      }
      this.chartRegion = this.covidFilter.state;
      this.totals = this.getTotals;
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
