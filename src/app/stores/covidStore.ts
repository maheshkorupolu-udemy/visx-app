import {
  action,
  observable,
  runInAction,
  makeObservable,
  computed,
} from "mobx";
import agent from "../api/agent";
import { IStateDistrictData } from "../models/statedistrictdata";
import { IStateInfo } from "../models/stateinfo";
import { ITimeLineData } from "../models/timelinedata";
import { RootStore } from "./rootStore";

export default class CovidStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    makeObservable(this, {
      timeLineData: observable,
      loadingIntial: observable,
      stateDistrictWiseData: observable,
      covid19StateWiseRegistry: observable,
      //getCovid19StateWiseData: computed,
      loadTimeLineData: action,
      loadStateDistrictWiseData: action,
    });

    this.rootStore = rootStore;
  }
  timeLineData: ITimeLineData[] = [];
  stateDistrictWiseData: IStateDistrictData | null = null;
  loadingIntial = false;
  covid19StateWiseRegistry = new Map();

  getCovid19StateWiseData = () => {
    if (this.stateDistrictWiseData != null) {
      return Object.entries(this.stateDistrictWiseData?.statewise);
    }
  };

  loadTimeLineData = async () => {
    this.timeLineData = [];
    this.loadingIntial = true;
    try {
      const timeLineDataLst = await agent.covidtimelinedata.list();
      runInAction(() => {
        timeLineDataLst.forEach((result) => {
          this.timeLineData.push(result);
        });
        this.loadingIntial = false;
      });
    } catch (error) {
      console.log(error);
    }
  };

  loadStateDistrictWiseData = async () => {
    this.loadingIntial = true;
    try {
      const result = await agent.statedistrictdata.details();
      Object.entries(result.state_wise).forEach(([key, value]) => {
        let v: unknown = value as any;
        let va: any = v;
        console.log(va.active);
        /*if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([key, value]) => {
            console.log(value);
          });
        }*/
      });
      runInAction(() => {
        this.stateDistrictWiseData = {
          keyvalues: null,
          totals: {
            active: result.total_values.active,
            confirmed: result.total_values.confirmed,
            deaths: result.total_values.deaths,
            lastupdatedtime: result.total_values.lastupdatedtime,
            migratedother: result.total_values.migratedother,
            recovered: result.total_values.recovered,
            state: result.total_values.state,
            statecode: result.total_values.statecode,
            statenotes: result.total_values.statenotes,
          },
          statewise: [],
        };
        this.loadingIntial = false;
      });
    } catch (error) {
      console.log(error);
    }
  };

  getStateDistrictWiseDate = (info: any) => {
    let stateInfoLst: IStateInfo[] = [];
    Object.entries(info.state_wise).forEach(([key, value]) => {});
  };
}
