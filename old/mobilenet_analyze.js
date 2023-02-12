import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

import * as mobilenet from "@tensorflow-models/mobilenet";

const image = document.getElementById("img");
const version = 2;
const alpha = 0.5;

export async function imageDetector() {
  const model = await mobilenet.load({ version, alpha });

  const predictions = await model.classify(image);
  console.log("Predictions:");
  console.log(predictions);

  // Logits and embedding

  const logits = model.infer(image);
  const embedding = model.infer(image, true);
  console.log("First Logits then Embeddings:");
  logits.print(true);
  embedding.print(true);
}

imageDetector();
