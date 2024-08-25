"use client"

import { Suspense, useState } from "react";
import TopicMarketplace from "../components/body/createTopics/topicMarketplace";
import SideNav from "../components/sideNav/sideNav";

export default function Page() {
    const [sideNavOut, setSideNavOut] = useState(false);
    return (
      <div className="flex flex-row">
        <SideNav {...{sideNavOut, setSideNavOut}}></SideNav>
        {/*<Suspense>*/}
            <TopicMarketplace />
        {/*</Suspense>*/}
      </div>
    )
  }