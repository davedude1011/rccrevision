"use client"

import { useEffect, useState } from "react"
import { searchTopicsData } from "~/server/search"
import { getSubscribedTopics } from "~/server/topicsData";

import { ReactTyped } from "react-typed"
import Link from "next/link";

import skelitonData from "./skelitonData.json"

export default function SearchPage() {
    const [topicsData, setTopicsData] = useState([] as {
        id: number;
        topicId: string;
        title: string | null;
        path: string | null;
        authorId: string | null;
        baseTopic: boolean | null;
        private: boolean | null;
        createdAt: Date;
        updatedAt: Date | null;
    }[])
    useEffect(() => {
        getSubscribedTopics()
            .then((response) => setTopicsData(response as {
                id: number;
                topicId: string;
                title: string | null;
                path: string | null;
                authorId: string | null;
                baseTopic: boolean | null;
                private: boolean | null;
                createdAt: Date;
                updatedAt: Date | null;
            }[]))
            .catch((error) => {console.log(error)})
    }, [])
    const [topics, setTopics] = useState([] as {title: string, path: string}[])
    const [searchQuery, setSearchQuery] = useState("")
    useEffect(() => {
        if (topicsData && searchQuery) {
            searchTopicsData(searchQuery, topicsData)
                .then((bookData) => setTopics(bookData))
                .catch((error) => console.error(error))
        }
        else {
            setTopics([])
        }
    }, [searchQuery, topicsData])
    return (
        <div className="flex flex-col gap-12 p-4 md:p-12 min-w-full min-h-full">
            <div className="flex md:px-12">
                <ReactTyped
                    strings={[
                        "Search for Topics",
                        "Look for Studies",
                        "Search...",
                        "Search for Paths",
                        "looks for Lessons",
                        "Search for Resources",
                        "Just start Searching..."
                    ]}
                    typeSpeed={40}
                    backSpeed={60}
                    attr="placeholder"
                    loop
                    className="flex flex-grow"
                >
                    <input className="flex flex-grow border rounded-full opacity-50 hover:opacity-100 focus:opacity-100 bg-transparent p-2 text-xl focus:outline-none text-center" type="text" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} />
                </ReactTyped>
            </div>
            <div className="flex flex-row flex-wrap gap-2">
                {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    (topics.length == 0 && topicsData.length == 0) && skelitonData.map(({ title, path }: { title: string, path: string }, index: number) => (
                        <button key={index} className="flex flex-col p-2 border rounded-md opacity-25 hover:opacity-100 flex-grow hover:rounded-[50px] transition-all cursor-pointer text-center gap-2">
                            <div className="text-xl bg-white opacity-25 rounded-md">{title}</div>
                            <div className="text-xs font-thin opacity-10 rounded-md bg-white">{path}</div>
                        </button>
                    ))
                }
                {
                    (topics.length > 0 ? topics : topicsData.map((topic) => ({title: (topic.title)??"", path: (topic.path)??""}))).map(({ title, path }: { title: string, path: string }, index) => (
                        <Link key={index} href={"/topics?path=" + path.replaceAll("&", "AMPERSAND")} className="flex flex-col p-2 border rounded-md opacity-50 hover:opacity-100 flex-grow hover:rounded-[50px] transition-all cursor-pointer text-center">
                            <div className="text-lg md:text-xl">{title}</div>
                            <div className="text-xs font-thin opacity-50">{path}</div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}