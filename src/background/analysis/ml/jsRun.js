import * as tf from '@tensorflow/tfjs';
import { BertTokenizer } from './index';
// import * as bertTokenizer from "./bertTokenizer"

const path = 'https://raw.githubusercontent.com/danielgoldelman/modelrepo/main/tiny2/tiny2_web/model.json';
const vocabUrl = './vocab.json'

let model;
let tokenizer;

// const path = "https://storage.googleapis.com/tfjs-testing/tfjs-automl/img_classification/model.json"

export async function loadModel() {
    // const meta = await tf.node.getMetaGraphsFromSavedModel(path)
    // console.log(JSON.stringify(meta, null, 4));

    // Warm up the model
    if (!model) {
      // Load the TensorFlow SavedModel through tfjs-node API. You can find more
      // details in the API documentation:
      // https://js.tensorflow.org/api_node/1.3.1/#node.loadSavedModel

        model = await tf.loadGraphModel(path)
      }
    if (!tokenizer) {
      tokenizer = new BertTokenizer(vocabUrl, true)
    }
    const sentance = 'I like strawberries'
    const tokens = tokenizer.tokenize(sentance)
    const tensor = tf.tensor(tokens, [-1,384], 'int32')
    console.log(await model.predict(tensor))
    // const tempTensor = tf.zeros([1,1,320,1280]).toInt();
    // const tempTensor2 = tf.zeros([1,1,320,1280]).toInt();
    // const outputmap1 = await model.predict([tempTensor, tempTensor2]);
    // console.log(outputmap1);
    // const ret1 = await Promise.all([
    //     outputmap1["logits"].squeeze().array()
    // ])

    // console.log(ret1)
  }