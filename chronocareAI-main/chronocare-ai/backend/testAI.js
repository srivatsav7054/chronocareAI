import { analyzeReport } from "./services/aiService.js";

const test = async () => {

  const result = await analyzeReport(
    "Patient has high cholesterol and severe cardiac condition"
  );

  console.log(result);

};

test();
