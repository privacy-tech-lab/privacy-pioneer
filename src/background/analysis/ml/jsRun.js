import * as tf from '@tensorflow/tfjs-node'
import { BertWordPieceTokenizer } from 'tokenizers'
// const tf = require('@tensorflow/tfjs-node')
// const { BertWordPieceTokenizer } = require("tokenizers");

const filePath = __dirname + "/binary_tok/vocab.txt";
const path = "file://" + __dirname + "/binary_model_web"

let model;

export async function loadModel() {
    // const meta = await tf.node.getMetaGraphsFromSavedModel(path)
    // console.log(JSON.stringify(meta, null, 4));

    // Warm up the model
    if (!model) {
      // Load the TensorFlow SavedModel through tfjs-node API. You can find more
      // details in the API documentation:
      // https://js.tensorflow.org/api_node/1.3.1/#node.loadSavedModel

      model = await tf.loadGraphModel(path);
    }
    const tempTensor = tf.zeros([1,384]).toInt();
    const tempTensor2 = tf.zeros([1,384]).toInt();
    const outputmap1 = model.predict([tempTensor, tempTensor2]);
    // const ret1 = await Promise.all([
    //     outputmap1["logits"].squeeze().array()
    // ])

    // console.log(ret1)
  }

export async function mlRunner(inputString) {
    loadModel()

    const wordPieceTokenizer = await BertWordPieceTokenizer.fromOptions({ vocabFile: filePath });
    wordPieceTokenizer.setPadding({ maxLength: 384 }); 
    const wpEncoded = await wordPieceTokenizer.encode(inputString);
    console.log(wpEncoded.tokens)
    // const wpEncoded = await wordPieceTokenizer.encode(`"/geo/location/dnsfeed","responseData":"dnsfeed({\"country\":\"US\",\"state\":\"CA\",\"stateName\":\"<TARGET_ST>\",\"zipcode\":\<TARGET_ZIP>",\"timezone\":\"America/<TARGET_CITY>\",\"latitude\":\"<TARGET_LAT>\",\"longitude\"`);

    // console.log('here ---> ', JSON.stringify(wpEncoded, null, 2))

    // const ids = wpEncoded.ids
    // const attentionMask = wpEncoded.attentionMask

    // const inputTensor = tf.tensor(values=ids, [1,384], dtype="int32");
    // const maskTensor = tf.tensor(values=attentionMask, [1,384], dtype="int32");

    // const outputmap = model.predict({"input_ids": inputTensor, "attention_mask": maskTensor})
    // // const outputmap = model.predict([inputTensor])

    // const ret = await Promise.all([
    //     outputmap["logits"].squeeze().array()
    // ])

    // console.log(ret)
}

mlRunner(`Paris is the [MASK] of France`)


// "[CLS] /geo/location/dnsfeed","responseData":"dnsfeed({\"country\":\"US\",\"state\":\"CA\",\"stateName\":\"<TARGET_ST>\",\"zipcode\":\<TARGET_ZIP>",\"timezone\":\"America/<TARGET_CITY>\",\"latitude\":\"<TARGET_LAT>\",\"longitude\" [SEP]"