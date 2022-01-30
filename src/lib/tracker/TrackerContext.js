import { createContext } from "react";
import Tracker from "./Tracker";

const tracker = new Tracker();
tracker.init({
  api_host: process.env.REACT_APP_TRACKER_API_HOST
});

const TrackerContext = createContext(tracker);
export default TrackerContext;
