import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar,Container,Nav } from "react-bootstrap";
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import WebInterface from './WebInterface';
import SurveyDetails from './SurveyDetails';
import SurveyList from './SurveyLists';
import {BrowserRouter as Router,Routes,Route,} from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div>
    <Navbar bg="dark" expand="lg" variant="dark"  fixed="top">
      <Container>
        <Navbar.Brand>Aplikasi Penghitung Kendaraan</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Buat Survei</Nav.Link>
            <Nav.Link href="/list">Daftar Survei</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <main className="container p-5">
      <div className="bg-light p-5 rounded">
        <Router>
          <Routes>
            <Route path="list"  element={<SurveyList />}/>
            <Route path="list/details/:fileName" element={<SurveyDetails />} />
            <Route path="/"  element={<WebInterface/>} />
          </Routes>
      </Router>
      </div>
    </main>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
