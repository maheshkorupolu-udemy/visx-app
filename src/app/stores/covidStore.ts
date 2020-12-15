import {
  action,
  observable,
  runInAction,
  makeObservable,
  computed,
} from "mobx";
import agent from "../api/agent";
import { IDistrictInfo } from "../models/districtinfo";
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
      loadingTimeLineData: observable,
      stateDistrictWiseData: observable,
      getCovid19StateWiseData: computed,
      loadTimeLineData: action,
      loadStateDistrictWiseData: action,
    });

    this.rootStore = rootStore;
  }
  timeLineData: ITimeLineData[] = [];
  stateDistrictWiseData: IStateDistrictData | null = null;
  loadingIntial = false;
  loadingTimeLineData = false;

  get getCovid19StateWiseData() {
    if (this.stateDistrictWiseData != null) {
      return this.stateDistrictWiseData?.statewise;
    } else {
      return null;
    }
  }

  loadTimeLineData = async () => {
    this.timeLineData = [];
    this.loadingTimeLineData = true;
    try {
      const timeLineDataLst = await agent.covidtimelinedata.list();
      runInAction(() => {
        timeLineDataLst.forEach((result) => {
          this.timeLineData.push(result);
        });
        this.loadingTimeLineData = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingTimeLineData = false;
      });
      console.log(error);
    }
  };

  loadStateDistrictWiseData = async () => {
    this.loadingIntial = true;
    try {
      const result = await agent.statedistrictdata.details();
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
          statewise: this.getStates(result),
        };
        this.loadingIntial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingIntial = false;
      });
      console.log(error);
    }
  };

  getStates = (info: any) => {
    let stateInfoLst: IStateInfo[] = [];
    Object.entries(info.state_wise).forEach(([key, value]) => {
      const statewise: any = value;
      let stateInfo: IStateInfo = {
        name: key,
        totals: {
          active: statewise.active,
          confirmed: statewise.confirmed,
          deaths: statewise.deaths,
          lastupdatedtime: statewise.lastupdatedtime,
          migratedother: statewise.migratedother,
          recovered: statewise.recovered,
          state: statewise.state,
          statecode: statewise.statecode,
          statenotes: statewise.statenotes,
        },
        districts: this.getDistricts(statewise),
      };
      stateInfoLst.push(stateInfo);
    });
    return stateInfoLst;
  };

  getDistricts = (info: any) => {
    let districts: IDistrictInfo[] = [];
    Object.entries(info.district).forEach(([key, value]) => {
      const districtwise: any = value;
      let districtInfo: IDistrictInfo = {
        name: key,
        notes: districtwise.notes,
        active: districtwise.active,
        confirmed: districtwise.confirmed,
        deceased: districtwise.deceased,
        recovered: districtwise.recovered,
      };
      districts.push(districtInfo);
    });
    return districts;
  };
}
