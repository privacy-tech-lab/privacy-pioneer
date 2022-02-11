import * as tf from '@tensorflow/tfjs';
// const {tf} = require('@tensorflow/tfjs')
// import { BertTokenizer } from 'bert-tokenizer';
// const {BertTokenizer} = require('bert-tokenizer');

// const path = "https://raw.githubusercontent.com/danielgoldelman/modelrepo/main/model_unc_web/model.json"
// const path = 'https://raw.githubusercontent.com/privacy-tech-lab/privacy-pioneer-machine-learning/issue-1/model_sst2_web/model.json?token=GHSAT0AAAAAABQCCYOWF3NR44JVQ2FI6XVMYQNDTTQ'
// const path = 'https://raw.githubusercontent.com/privacy-tech-lab/privacy-pioneer-machine-learning/blob/issue-1/model_sst2_web/model.json'

const path = 'https://raw.githubusercontent.com/danielgoldelman/modelrepo/main/model_tiny_web/model.json';

// const vocabUrl = '/Users/danielgoldelman/Desktop/2nd_General_TinyBERT_4L_312D/vocab.txt'
// const vocabUrl = '/Users/danielgoldelman/Desktop/privacy-tech-lab/privacy-pioneer/node_modules/bert-tokenizer/assets/vocab.json'

// const bertTokenizer = new BertTokenizer(vocabUrl, true);

let model;

// const path = "https://storage.googleapis.com/tfjs-testing/tfjs-automl/img_classification/model.json"

export async function loadModel() {
    // const meta = await tf.node.getMetaGraphsFromSavedModel(path)
    // console.log(JSON.stringify(meta, null, 4));

    // Warm up the model
    if (!model) {
      // Load the TensorFlow SavedModel through tfjs-node API. You can find more
      // details in the API documentation:
      // https://js.tensorflow.org/api_node/1.3.1/#node.loadSavedModel

    //   model = await tf.loadGraphModel(path);
        model = await tf.loadGraphModel(path)
        console.log(model);
    }
    const response = await fetch('http://localhost:3000/', {headers:{text:'I like strawberries'}})
    const tokens = await response.json()
    console.log(tokens)
    // const tempTensor = tf.zeros([1,1,320,1280]).toInt();
    // const tempTensor2 = tf.zeros([1,1,320,1280]).toInt();
    // const outputmap1 = await model.predict([tempTensor, tempTensor2]);
    // console.log(outputmap1);
    // const ret1 = await Promise.all([
    //     outputmap1["logits"].squeeze().array()
    // ])

    // console.log(ret1)
  }