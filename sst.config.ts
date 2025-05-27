import { SSTConfig } from "sst";
import { API } from "./stacks/ApiStack";
import { Dynamo } from "./stacks/DynamoStack";

export default {
  config() {
    return {
      name: "auth",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Dynamo).stack(API);
  },
} satisfies SSTConfig;
