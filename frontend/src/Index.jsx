import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import WatchTv from "./pages/WatchTv";
const Index = () => {
  return (
    <div className="w-full ">
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/watch/:id"
          element={<Watch />}
        />
        <Route
          path="/watch/tv/:id/:ses/:ep"
          element={<WatchTv />}
        />
      </Routes>
    </div>
  );
};

export default Index;
