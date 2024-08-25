"use client"

import { Suspense, useState } from "react";
import SideNav from "../../components/sideNav/sideNav";
import CreateTopicsBody from "../../components/body/createTopics/createTopics";

export default function Page() {
    const [sideNavOut, setSideNavOut] = useState(false);
    return (
      <div className="flex flex-row">
        <SideNav {...{sideNavOut, setSideNavOut}}></SideNav>
        {/*<Suspense>*/}
            <CreateTopicsBody />
        {/*</Suspense>*/}
      </div>
    )
  }