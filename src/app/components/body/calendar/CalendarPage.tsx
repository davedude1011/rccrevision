"use client"

import { Suspense, useEffect, useState } from "react";
import { FaDivide } from "react-icons/fa";
import { getCalendarData } from "~/server/scraper";
import Image from "next/image";
import { LuCalendar, LuCalendarClock } from "react-icons/lu";

export default function CalendarPage() {
    const [calendarData, setCalendarData] = useState(undefined as string|undefined)
    useEffect(() => {
        getCalendarData()
            .then((response) => setCalendarData(response))
            .catch((error) => console.log(error))
    })

    if (calendarData) {
        return (
            <iframe src={calendarData} className="w-full h-full invert-[0.86]"></iframe>
        )
    }
    else {
        return (
            <div className="flex flex-row justify-center items-center w-full h-full">
                <div className="flex flex-row gap-4 items-center">
                    <LuCalendarClock size={36} />
                    <div className="text-4xl">Loading...</div>
                </div>
            </div>
        )
    }
}