import * as tf from '@tensorflow/tfjs';
import { BertTokenizer } from './index';
// import * as bertTokenizer from "./bertTokenizer"

// const path = 'https://raw.githubusercontent.com/danielgoldelman/modelrepo/main/tiny2/tiny2/model.json';
const path = 'https://raw.githubusercontent.com/danielgoldelman/modelrepo/main/tiny2/tiny2_am_web/model.json';
const vocabUrl = './vocab.json'

let model;
let tokenizer;

// const path = "https://storage.googleapis.com/tfjs-testing/tfjs-automl/img_classification/model.json"

/**
 * loadModel is called once to load the model from the internet, and saves the model to the indexeddb
 */
export async function loadModel() {
  // const meta = await tf.node.getMetaGraphsFromSavedModel(path)
  // console.log(JSON.stringify(meta, null, 4));

  // Warm up the model
    // Load the TensorFlow SavedModel through tfjs-node API. You can find more
    // details in the API documentation:
    // https://js.tensorflow.org/api_node/1.3.1/#node.loadSavedModel

  try {
    model = await tf.loadGraphModel(path);
  } catch (e) {
    console.log('error')
  }

  await model.save('indexeddb://my-model');

  // const tempTensor = tf.zeros([1,384]).toInt();
  // const tempTensor2 = tf.zeros([1,384]).toInt();
  // const res = await model.predict([tempTensor,tempTensor2]);

  // const tempTensor = tf.zeros([1,1,320,1280]).toInt();
  // const tempTensor2 = tf.zeros([1,1,320,1280]).toInt();
  // const outputmap1 = await model.predict([tempTensor, tempTensor2]);
  // console.log(outputmap1);
  // const ret1 = await Promise.all([
  //     outputmap1["logits"].squeeze().array()
  // ])

  // console.log(ret1)

  }

/**
 * useModel is the function that takes in a string as input and will console log the prediction from that model
 * @param {String} input The input string
 */
export async function useModel(input){
  if (model == undefined){
    model = await tf.loadGraphModel('indexeddb://my-model')
  }
  if (!tokenizer) {
    tokenizer = new BertTokenizer(vocabUrl, true)
  }
  const tokens = await tokenizer.tokenize(input)
  while (tokens.length < 384) {
    tokens.push(0)
  }
  const tensor = tf.tensor(tokens, [1,384], 'int32');
  const att = tf.zeros([1,384]).toInt();
  console.log(await model.predict([att, tensor]))
}