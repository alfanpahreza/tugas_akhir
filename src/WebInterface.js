import axios from 'axios';
import React, {useState} from "react";
import requestURL from "./Api";

function WebInterface() {

  const [selectedVideo, setSelectedVideo] = useState();
  const [surveyorName, setSurveyorName] = useState(" ");
  const [surveyDate, setSurveyDate] = useState(" ");
  const [streetConfig, setStreetConfig] = useState(" ");
  const [streetName, setStreetName] = useState(" ");
  const [message, setMessage] = useState("No Message");

  const selectVideo = (event) => {
    setSelectedVideo(event.target.files[0]);
  }

  const inputName = (event) => {
    setSurveyorName(event.target.value)
  }

  const inputStreetName = (event) => {
    setStreetName(event.target.value)
  }

  const inputStreetConfig = (event) => {
    setStreetConfig(event.target.value)
  }

  const inputDate = (event) => {
    setSurveyDate(event.target.value)
  }

  const uploadSurveyData = (video, street, config, name, date) => {
    let formData = new FormData();
    formData.append("file", video);
    formData.append("street_name",street);
    formData.append("street_configuration",config);
    formData.append("survey_date",date,);
    formData.append("surveyor_name",name);

    axios({
      method: 'post',
      url: requestURL+'survey',
      data: formData
    })
    .catch(() => {
      setMessage("Terjadi kesalahan saat upload video");
      setSelectedVideo(undefined);
    })
    .then((res) =>{
      setMessage(res.data.message)
      console.log(message)
    });
  };

  const beginSurvey = (event) => {
    event.preventDefault();
    let fileExtension = selectedVideo.name.split(".").pop();
    if(fileExtension === "mp4"){
      uploadSurveyData(selectedVideo,streetName,streetConfig,surveyorName,surveyDate)
    }
    else{
      setMessage("Format file salah!\n(hanya bisa menggunakan file .mp4)");
    }
  };

  return (
  <div>
    <h1>Survei Baru</h1>
    <div>
      <form className="row g-3" onSubmit={beginSurvey}>
        <div className="col-md-6">
          <label className="form-label">Nama Jalan</label>
          <input className="form-control" type="text" name="street" onInput={inputStreetName}/>
        </div>
        <div className="col-md-6">
          <label className="form-label">Konfigurasi Jalan</label>
          <input className="form-control" type="text" name="config" onInput={inputStreetConfig}/>
        </div>
        <div className="col-md-6">
          <label className="form-label">Nama Penyurvei</label>
          <input className="form-control" type="text" name="name" onInput={inputName}/>
        </div>
        <div className="col-md-6">
          <label className="form-label">Tanggal Survei</label>
          <input className="form-control" type="date" name="date" onInput={inputDate}/>
        </div>
        <div className="col-md-6">
          <label className="form-label">Video</label>
          <input className="form-control" type="file" accept=".mp4" onInput={selectVideo}/>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-success">Submit Data</button>
        </div>
      </form>
      <div className="card m-3 text-center">
        {message}
      </div>
    </div>  
  </div>
  );
}
export default WebInterface;
