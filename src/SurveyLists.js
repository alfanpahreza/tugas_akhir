import axios from 'axios';
import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import requestURL  from "./Api";
import { Button, Table } from 'react-bootstrap';

function SurveyList() {

    const [surveyListData, setSurveyListData] = useState()
    const [message, setMessage] = useState("No Message");

    const arrayToJSON = (array) => {
        let result = JSON.stringify(Object.assign({},array))
        return result
    }

    const clearData = () => {
        setSurveyListData(null)
        localStorage.clear()
    }

    useEffect(()=>{
        const fetchData = () => {
            let surveys = [];
            axios({
                method: 'get',
                url: requestURL + 'surveys',
            })
                .catch(() => {
                    setMessage("Terjadi kesalahan saat mengambil daftar survei");
                })
                .then((res) => {
                    if(res){
                        surveys = (res.data.data);
                        setMessage(res.data.message);
                        setSurveyListData(surveys);
                        localStorage.clear()
                        localStorage.setItem("daftarSurvei",arrayToJSON(surveys));
                    }
                });
            return surveys;
        };
        if(surveyListData == null){
            fetchData();
        }
    },[surveyListData]);

    const printSurveys = () => {
        let surveyJSON = JSON.parse(localStorage.getItem("daftarSurvei"));
        let surveyArray = [];
        let table = (<tr><td colSpan={3}>Belum ada data hasil survei (klik 'Refresh' untuk memuat ulang)</td></tr>);
        if(surveyJSON!=null){
            for (var i in surveyJSON) {
                surveyArray.push(surveyJSON[i]);
            }
            table = surveyArray.map((item,index) => {
                let data = item.split('_');
                let fileName = item.replace(/\s/g, "%20");
                return(
                    <tr key={index}>
                        <td>
                            {data[0]}
                        </td>
                        <td>
                            {data[1]}
                        </td>
                        <td>
                            {data[2]+".mp4"}
                        </td>
                        <td><Link to={`details/${fileName}`} className="btn btn-primary"><i className="bi bi-download"></i></Link></td>
                    </tr>
                )
            });
        }   
        return (
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th scope="col">Tanggal</th>
                        <th scope="col">Penyurvei</th>
                        <th scope="col">Nama File Video</th>
                        <th scope="col">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {table}
                </tbody>
            </Table>
        )
      }

    return(
        <div>
            <h1>Daftar Survei</h1>
            {surveyListData && (printSurveys())}
            <Button onClick={clearData} variant="primary">
                Refresh
            </Button>
            <div className="card m-3 text-center">
                {message}
            </div>
        </div>
    )
}
export default SurveyList;