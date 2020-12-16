import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

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
  get: (url: string) => axios.get(url).then(responseBody),
};

const covidstathistory = {
  info: () => requests.get("https://api.rootnet.in/covid19-in/stats/history"),
};

const covidstatlatest = {
  info: () => requests.get("https://api.rootnet.in/covid19-in/stats/latest"),
};

const coviddata = {
  covidstathistory,
  covidstatlatest,
};

export default coviddata;
