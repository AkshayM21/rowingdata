
import './App.css';
import React from 'react';
import Login from './Pages/AuthenticationPage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProvider from "./providers/UserProvider";
import Base from './Base'
import Rower from "./rower_view"
import Page from "./coach_view"
import {Header} from "./Header"


function App() {

  return (
    <div className="App">
    <UserProvider>
    <Router>
    <Base/>
    <Header className="header" />
    <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/rower_view" element={<Rower/>} />
          <Route path="/coach_view" element={<Page/>} />
        </Routes>
    </div>
    </Router>
    </UserProvider>
    </div>
  );
}




export default App;
