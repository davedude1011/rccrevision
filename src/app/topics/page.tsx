"use client"

import { Suspense, useState } from "react";
import TopicsNavigation from "../components/body/topics/topicsNavigation";

export default function Page() {
    return (
      <Suspense>
          <TopicsNavigation />
      </Suspense>
    )
  }