import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, {useState, useEffect} from "react";
import axios from 'axios';

function WebInterface() {
  const [selectedVideo, setSelectedVideo] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("No Message");
  const [surveyResult, setSurveyResult] = useState(null);
  const requestURL = "http://8460-35-185-55-86.ngrok.io/";
  axios.defaults.timeout = 86400000; //1000 ms * 60 second * 60 minutes * 24 hour
  const selectFile = (event) => {
    setSelectedVideo(event.target.files);
  };

  const upload = (video, onUploadProgress) => {
    let formData = new FormData();
    formData.append("file", video);
    axios({
      method: 'post',
      url: requestURL+'counting',
      data: formData
    })
    .catch(() => {
      setProgress(0);
      setMessage("Could not upload the video!");
      setSelectedVideo(undefined);
    })
    .then((res) =>{
      setSurveyResult(res.data);
      localStorage.clear()
      localStorage.setItem('result', JSON.stringify(surveyResult))
    });
    
    return onUploadProgress;
  };

  const uploadVideo = () => {
    let file = selectedVideo[0]
    let fileExtension = file.name.split(".").pop();
    if(fileExtension === "mp4"){
      setProgress(0);
      upload(file, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      })
    }
    else{
      setMessage("File format is unsupported!\n(only upload mp4 files)")
    }
  };

  useEffect(() => {
    let result = JSON.parse(localStorage.getItem('result'))
    if (result){
      setSurveyResult(result);
    }
  }, []);

  useEffect(() => {
    console.log(surveyResult)
  })

  return (
  <div>
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <h2 className="navbar-brand">Aplikasi Penghitung Kendaraan</h2>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/home">Home</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container">
        <div className="bg-light p-5 rounded">
          <p></p>
          <h1>Upload File</h1>
          <div>
            {selectedVideo && (
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info progress-bar-striped"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progress + "%" }}
                >
                {progress}%
                </div>
              </div>
            )}
            <label className="btn btn-default">
              <input type="file" accept=".mp4" onChange={selectFile}/>
            </label>
            <button
              className="btn btn-success"
              onClick={uploadVideo}
            >
              Upload
            </button>
            <div className="card">
              {message}
            </div>
          </div>  
        </div>
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col">Interval</th>
              <th scope="col">Sepeda Motor</th>
              <th scope="col">Sedan / Jeep</th>
              <th scope="col">Opelet / Mini Bus</th>
              <th scope="col">Pick-Up</th>
              <th scope="col">Bus Kecil</th>
              <th scope="col">Bus Besar</th>
              <th scope="col">Truk 2 Sumbu 4 Roda</th>
              <th scope="col">Truk 2 Sumbu 6 Roda</th>
              <th scope="col">Truk 3 Sumbu</th>
              <th scope="col">Truk Gandeng</th>
              <th scope="col">Truk Semi Trailer</th>
              <th scope="col">Tidak Bermotor</th>
            </tr>
          </thead>
          <tbody>
            {surveyResult && (
              surveyResult.map(item => (
              <tr key={item.interval}>
                <td>{item.interval}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </main>
  </div>
  );
}

export default WebInterface;
