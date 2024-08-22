"use client"

import { Suspense, useState } from "react";
import SideNav from "../components/sideNav/sideNav";
import TopicsNavigation from "../components/body/topics/topicsNavigation";

export default function Page() {
    const [sideNavOut, setSideNavOut] = useState(false);
    return (
      <div className="flex flex-row">
        <SideNav {...{sideNavOut, setSideNavOut}}></SideNav>
        <Suspense>
            <TopicsNavigation />
        </Suspense>
      </div>
    )
  }