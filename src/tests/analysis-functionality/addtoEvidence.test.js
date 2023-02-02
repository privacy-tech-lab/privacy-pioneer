import { addToEvidenceStore, updateFetchedDict } from "../../background/analysis/interactDB/addEvidence.js"
import { loadModel, useModel } from "../../background/analysis/interactDB/ml/jsrun.js"
import mlEvidence from "../mock-data/mockEvidence.json"
import { lengthHeuristic } from "../../background/analysis/requestAnalysis/earlyTermination/heuristics.js"

test("test lengthHeuristic", async () => {
    const long = '1'.repeat(100001)
    const medium = 'a'.repeat(8000)
    expect(lengthHeuristic(long)).toBeTruthy()
    expect(lengthHeuristic(medium)).toBeFalsy()
    expect(lengthHeuristic(mlEvidence.heurisitc_short)).toBeFalsy()
  });
