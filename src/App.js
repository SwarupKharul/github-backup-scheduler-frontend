import React from "react";
import Landing from "./components/landing";
import BackupList from "./components/history";
import { ToastContainer } from 'react-toastify';
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Landing />
      <BackupList />
      <ToastContainer />
    </div>
  );
}

export default App;