import { SSTConfig } from "sst";
import { API } from "./stacks/ApiStack";

export default {
  config() {
    return {
      name: "auth",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
