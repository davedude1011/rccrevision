"use client"

import { useState } from "react";
import SideNav from "./components/sideNav/sideNav";
import Body from "./components/body/body";

export default function HomePage() {
  const [sideNavOut, setSideNavOut] = useState(false);
  return (
    <div className="flex flex-row">
      <SideNav {...{sideNavOut, setSideNavOut}}></SideNav>
      <Body />
    </div>
  )
}