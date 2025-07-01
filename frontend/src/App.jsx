import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Index from "./Index";
import TopNavbar from "./components/TopNavbar";

const App = () => {
  return (
    <div className="bg-zinc-800 w-full min-h-screen text-zinc-300 flex flex-col">
      <Router>
        <TopNavbar />
        <div className="flex-1 pb-10">
          <Index />
        </div>
        <footer className="w-full bg-zinc-900 text-zinc-400 py-6 px-4 text-center shadow-inner fixed bottom-0 left-0 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2">
            <span className="text-sm">&copy; {new Date().getFullYear()} MovieFlix. All rights reserved.</span>
            
          </div>
        </footer>
      </Router>
    </div>
  );
};

export default App;
