import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import tensorflowLogo from "./assets/Tensorflow.png";
import koma from "./assets/koma.png";
import "./App.css";
import "./styles/dnd.css";
import "@tensorflow/tfjs";
import * as mobileNet from "@tensorflow-models/mobilenet";
import Probabilities from './components/Probabilities';
import { Loader } from './components/Loader';
import { RepositoryMetrics } from "repository-metrics";

function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [imageURL, setImageURl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      const model = await mobileNet.load();
      setModel(model);
    };
    loadModel();
  }, []);

  const handleUploadChange = ({ target }) => {
    setImageURl(URL.createObjectURL(target.files[0]));
  };

  const drawImageOnCanvas = (image, canvas, ctx) => {
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const isLandscape = naturalWidth > naturalHeight;
    ctx.drawImage(
      image,
      isLandscape ? (naturalWidth - naturalHeight) / 2 : 0,
      isLandscape ? 0 : (naturalHeight - naturalWidth) / 2,
      isLandscape ? naturalHeight : naturalWidth,
      isLandscape ? naturalHeight : naturalWidth,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
  };

  const onImageChange = async ({ target }) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawImageOnCanvas(target, canvas, ctx);

    const predictions = await model.classify(canvas, 5);
    console.log(predictions);
    setPredictions(predictions);
  };

  return (
    <div className="App">
      <h1 className="title">KomAI - Image Analyzer</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <RepositoryMetrics
          owner='Ivan-Corporation'
          repo='KomAI-ImageDetector'
          theme='dark'

        />
      </div>
      <p className="description">
        Upload any image and artificial intelligence will analyze the <br />
        probability of finding a certain object on it. <br /> <span style={{ fontWeight: '700' }}> Recommended format 1x1</span>
      </p>
      <div className="logos">
        <div>
          <img
            src={tensorflowLogo}
            className="logo tensorflow"
            alt="Tensorflow logo"
          />
        </div>
        <div>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <div>
          <img src={koma} className="logo koma" alt="Koma logo" />
        </div>
      </div>
      {!model ? (
        <Loader />
      ) : (
        <div>
          <div>

            {/* <input
              type="file"
              onChange={handleUploadChange}
              accept="image/x-png,image/gif,image/jpeg"
            /> */}
          </div>
          {imageURL && <div>
            <div className="image-container">
              <canvas className="classified-image" ref={canvasRef}>
                <img alt="preview" onLoad={onImageChange} src={imageURL} />
              </canvas>
              {!!predictions.length && <Probabilities predictions={predictions} />}
            </div>
          </div>
          }
          <div className="image-upload-wrap">
            <input className="file-upload-input" type='file' onChange={handleUploadChange}
              accept="image/x-png,image/gif,image/jpeg" />
            <div className="drag-text">
              <h3>Drag and drop a file or select add Image</h3>
            </div>
          </div>
        </div>

      )}

    </div>
  );
}

export default App;
