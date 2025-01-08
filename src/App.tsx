import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/stations" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
