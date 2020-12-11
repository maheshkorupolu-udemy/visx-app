import { configure } from "mobx";
import { createContext } from "react";
import CovidStore from "./covidStore";
configure({ enforceActions: "always" });
export class RootStore {
  covidStore: CovidStore;
  constructor() {
    this.covidStore = new CovidStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
