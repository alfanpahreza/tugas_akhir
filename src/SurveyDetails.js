import axios from 'axios';
import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import requestURL from './Api';
import { Button,Table } from 'react-bootstrap';

function SurveyDetails() {

  let {fileName} = useParams();

  const [details, setDetails] = useState(null);
  const [message, setMessage] = useState("No Message");

  const getVehicleClasses = () => {
    let vehicleClasses = [
                          "sepeda_motor",
                          "sedan_jeep_wagon",
                          "angkutan_sedang",
                          "pick_up_micro_truk",
                          "bus_kecil",
                          "bus_besar",
                          "truk_2_sumbu_4_roda",
                          "truk_2_sumbu_6_roda",
                          "truk_3_sumbu",
                          "truk_gandeng",
                          "truk_semitrailer",
                          "tidak_bermotor"
                        ]
    return vehicleClasses
  }
  
  const parseClasses = (dataArray) => {
    let newArray = [];
    let classes = getVehicleClasses();
    dataArray.forEach(data => {
      var i = 0
      classes.forEach(className => {
        if(className === data.class){
          newArray[i] = data.count
        }
        i++
      });
    });
    //use for loop not foreach loop, because foreach skips empty (uninitialized) values
    for(let i = 0; i < 12; i++){
      if(newArray[i] == null){
        newArray[i] = 0
      }
    }
    return newArray
  }

  const totalPerClass = (dataJSON) => {
    dataJSON = dataJSON.data_survei
    let arrInterval = [];
    let jumlah = new Array(12).fill(0)
    arrInterval = dataJSON.map(item => (
      parseClasses(item.data)
    ));
    for (let i=0; i<arrInterval.length; i++ ){
      for (let j=0; j<arrInterval[i].length; j++ ){
        jumlah[j] += arrInterval[i][j]
      }
    }
    return jumlah
  }

  const printDetails = (dataArray) => {
    const reducer = (accumulator, curr) => accumulator + curr;
    let table = dataArray.data_survei.map(item => (
      <tr key={item.interval}>
        <td>{item.interval}</td>
        {parseClasses(item.data).map((counts,index)=>(
            <td key={index}>{counts}</td>
        ))}
        <td>{parseClasses(item.data).reduce(reducer)}</td>
      </tr>
    ))
    return (
      <Table striped bordered hover responsive size='sm' className='text-center'>
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
            <th scope="col">Total Seluruh Kendaraan</th>
          </tr>
        </thead>
        <tbody>
          {table}
        </tbody>
        <tfoot>
          <tr>
            <td className='fw-bold'>Jumlah</td>
            {totalPerClass(dataArray).map((total,index)=>(
              <td key={index}>{total}</td>
            ))}
            <td>{totalPerClass(dataArray).reduce(reducer)}</td>
          </tr>
        </tfoot>
      </Table>
    )
  }
  
    useEffect(() => {
      const fetchDetails = () => {
        axios({
            method: 'get',
            url: requestURL + 'survey/'+ fileName,
        })
            .catch(() => {
                setMessage("Terjadi kesalahan saat mengambil rincian survei");
            })
            .then((res) => {
                let result = res.data.data;
                setMessage(res.data.message)
                if(result){
                  localStorage.setItem(fileName,JSON.stringify(result))
                  setDetails(JSON.parse(localStorage.getItem(fileName)))
                }
            });
      }
      if (details == null) {
        let localData = JSON.parse(localStorage.getItem(fileName))
        if(localData == null){
          fetchDetails();
        }else{
          setDetails(localData)
        }
      }
    }, [details, fileName]);

    return (
    <div>
      <h1>Rincian Hasil Survei</h1>
      <div className="d-flex flex-row bd-highlight mb-3">
        <div className="p-2 bd-highlight fw-bold">Nama Jalan:</div>
        <div className="p-2 bd-highlight">{details && (details.nama_jalan)}</div>
        <div className="p-2 bd-highlight fw-bold">Konfigurasi Jalan:</div>
        <div className="p-2 bd-highlight">{details && (details.konfigurasi_jalan)}</div>
      </div>
      <div className="d-flex flex-row bd-highlight mb-3">
      <div className="p-2 bd-highlight fw-bold">Tanggal Survei:</div>
        <div className="p-2 bd-highlight">{details && (details.tanggal_survei)}</div>
        <div className="p-2 bd-highlight fw-bold">Nama Penyurvei:</div>
        <div className="p-2 bd-highlight">{details && (details.nama_penyurvei)}</div>
      </div>
      {details && (printDetails(details))}
      <Button href={requestURL + "survey/excel/" + fileName} variant="primary">
          Download File Excel
      </Button>
      <div className="card m-3 text-center">
          {message}
      </div>
    </div>
    )
}
export default SurveyDetails;