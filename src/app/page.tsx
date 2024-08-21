"use client"

import { useState } from "react";
import SideNav from "./components/sideNav/sideNav";
import Body from "./components/body/body";
import TopicsNavigation from "./components/body/topics/topicsNavigaton";

function getBodyElementFromName(name: string) {
  switch (name) {
    case "homepage":
      return <Body />
    case "topics":
      return <TopicsNavigation />
    }
}

export default function HomePage() {
  const [bodyElementName, setBodyElementName] = useState("homepage");
  const [sideNavOut, setSideNavOut] = useState(false);
  return (
    <div className="flex flex-row">
      <SideNav {...{sideNavOut, setSideNavOut, bodyElementName, setBodyElementName}}></SideNav>
      {getBodyElementFromName(bodyElementName)}
    </div>
  )
}