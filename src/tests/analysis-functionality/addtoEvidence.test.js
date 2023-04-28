import { useModel } from "../../background/analysis/interactDB/ml/jsrun.js";
import mlEvidence from "../mock-data/mockEvidence.json";
import { lengthHeuristic } from "../../background/analysis/requestAnalysis/earlyTermination/heuristics.js";
import * as tf from "@tensorflow/tfjs-node";

const path =
  "https://raw.githubusercontent.com/privacy-tech-lab/privacy-pioneer-machine-learning/main/convertMultiModel/multitaskModelForJSWeb/model.json";
let model;

jest.setTimeout(30000);
test("test lengthHeuristic", async () => {
  const long = "1".repeat(100001);
  const medium = "a".repeat(8000);
  expect(lengthHeuristic(long)).toBeTruthy();
  expect(lengthHeuristic(medium)).toBeFalsy();
  expect(lengthHeuristic(mlEvidence.heurisitc_short)).toBeFalsy();
});
test("test load model", async () => {
  model = await tf.loadGraphModel(path);
  expect(model).toBeTruthy();
});

test("test ml region", async () => {
  const fail = await useModel(mlEvidence.ml_region_false, model);
  expect(fail).toBeFalsy();
});
test("test ml city", async () => {
  const fail = await useModel(mlEvidence.ml_city_false, model);
  expect(fail).toBeFalsy();
});

test("test ml zip", async () => {
  const fail = await useModel(mlEvidence.ml_zip_false, model);
  expect(fail).toBeFalsy();
});

test("test ml lat/lng", async () => {
  const fail = await useModel(mlEvidence.ml_lng_false, model);
  expect(fail).toBeFalsy();
});
