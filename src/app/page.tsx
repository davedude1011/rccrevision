"use client"

import { useState } from "react";
import SideNav from "./components/sideNav/sideNav";
import Body from "./components/body/body";
import TopicsNavigation from "./components/body/topics/topicsNavigaton";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

export default function HomePage() {
  const [sideNavOut, setSideNavOut] = useState(false);
  return (
    <Router>
      <div className="flex flex-row">
        <SideNav {...{sideNavOut, setSideNavOut}}></SideNav>
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/topics/*" element={<TopicsNavigation />} />
        </Routes>
      </div>
    </Router>
  )
}