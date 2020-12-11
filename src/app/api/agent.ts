import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ITimeLineData } from "../models/timelinedata";

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error.");
  }
  const { status, data, config } = error.response;
  if (status === 404) {
    toast.error("Notfound.");
    //history.push("/notfound");
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    toast.error("Notfound.");
    //history.push("/notfound");
  }
  if (status === 500) {
    toast.error("Server error, check terminal for more info!");
  }
  throw error;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) =>
    axios
      .get(url, {
        headers: {
          "x-rapidapi-key":
            "357cbbbf6dmsh1e53e487deda04fp1cc3a7jsnbdf34f2a74b6",
          "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
        },
      })
      .then(responseBody),
};

const covidtimelinedata = {
  list: (): Promise<ITimeLineData[]> =>
    requests.get(
      "https://corona-virus-world-and-india-data.p.rapidapi.com/api_india_timeline"
    ),
};

const statedistrictdata = {
  details: () =>
    requests.get(
      "https://corona-virus-world-and-india-data.p.rapidapi.com/api_india"
    ),
};

const coviddata = {
  covidtimelinedata,
  statedistrictdata,
};

export default coviddata;
