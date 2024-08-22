"use client"

import { MdOutlineSchool } from "react-icons/md"
import { IoBookOutline } from "react-icons/io5";
import { getFormattedData } from "~/server/topicsData";
import { useEffect, useState } from "react";
import { RxCaretRight } from "react-icons/rx";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { bodyStyling, theme } from "../../style";

const prebuiltData = [
    {
      title: 'Alpha',
      subtitle: 'Beta Gamma',
      items: ['Item 1', 'Item 2', 'Item 3']
    },
    {
      title: 'Zeta',
      subtitle: 'Delta Epsilon',
      items: ['Element 4', 'Element 5', 'Element 6']
    },
    {
      title: 'Gamma',
      subtitle: 'Theta Iota',
      items: ['Part 7', 'Part 8', 'Part 9']
    },
    {
      title: 'Kappa',
      subtitle: 'Lambda Mu',
      items: ['Detail 10', 'Detail 11', 'Detail 12']
    },
    {
      title: 'Epsilon',
      subtitle: 'Nu Xi',
      items: ['Fact 13', 'Fact 14', 'Fact 15']
    },
    {
      title: 'Omicron',
      subtitle: 'Pi Rho',
      items: ['Point 16', 'Point 17', 'Point 18']
    },
    {
      title: 'Sigma',
      subtitle: 'Tau Upsilon',
      items: ['Info 19', 'Info 20', 'Info 21']
    },
    {
      title: 'Rho',
      subtitle: 'Psi Omega',
      items: ['Note 22', 'Note 23', 'Note 24']
    },
    {
      title: 'Theta',
      subtitle: 'Iota Kappa',
      items: ['Entry 25', 'Entry 26', 'Entry 27']
    },
    {
      title: 'Upsilon',
      subtitle: 'Phi Chi',
      items: ['Data 28', 'Data 29', 'Data 30']
    },
    {
      title: 'Psi',
      subtitle: 'Omega Alpha',
      items: ['Point 31', 'Point 32', 'Point 33']
    }
  ];

function getValueAtPath(dictionary: never, path: string[]) {
    let currentLevel = dictionary;
  
    for (const key of path) {
      // Check if the key exists at the current level
      if (currentLevel[key] !== undefined) {
        currentLevel = currentLevel[key];
      } else {
        // If the key doesn't exist, return undefined or a default value
        return undefined;
      }
    }
  
    // Return the final value found at the path
    return currentLevel;
  }

function getRandomString(min: number, max: number) {
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    return Array.from({ length }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
};

export default function TopicsNavigation() {
    const [topicsArray, setTopicsArray] = useState([])
    useEffect(() => {
        getFormattedData()
           .then((data) => {
                setTopicsArray(data as never)
           })
           .catch((error) => console.error(error))
    }, [])

    const [pathArray, setPathArray] = useState([] as string[]) // @ts-expect-error just deal with it ok...
    const pathValue = getValueAtPath(topicsArray, pathArray)
    function getNextPathValue(subject: string) {// @ts-expect-error idk what :never is so um idk
        return getValueAtPath(topicsArray, [...pathArray, subject])
    }

    const router = useRouter()
    function updatePath(path: string) {
        router.push(
            path ? `/topics?path=${path}` : "/topics",
        )
    }

    const searchParams = useSearchParams()
    useEffect(() => {
        const locationPath = (searchParams.get("path")??"")
        setPathArray(locationPath ? locationPath.split("/").filter(Boolean) : [])
    }, [searchParams])

    return (
        <div className={`${bodyStyling} text-[${theme.text}] flex`}>
            <div className="w-full h-fit p-6 md:p-24 flex flex-col gap-2">
                <div className="w-full h-fit flex flex-row justify-between">
                    <span className="text-4xl">Topics</span>
                    <div className="flex flex-row gap-4 text-md">
                        {/*<button className={`flex flex-row gap-2 h-full rounded-md items-center px-2 border opacity-80 hover:opacity-100`}><FiSliders /> Toggle Options</button>*/}
                        <Link href={"/"}>
                            <span className="flex flex-row gap-2 h-full items-center cursor-pointer">RccRevision<MdOutlineSchool /></span>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-2 text-xs md:text-md font-thin p-2 rounded-md">
                    <div className="flex flex-row items-center gap-2 cursor-pointer opacity-50 hover:opacity-100" onClick={() => updatePath("")}>
                        <IoBookOutline />
                            <span>Subjects</span>
                    </div>
                    {
                        pathArray.map((subject, index) => (
                            <>
                                <RxCaretRight key={index} />
                                <div className="cursor-pointer opacity-50 hover:opacity-100"
                                        onClick={() => updatePath(`${pathArray.slice(0, pathArray.indexOf(subject) + 1).join("/")}`)}>
                                    {subject}
                                </div>
                            </>
                        ))
                    }
                </div>
                {
                    typeof pathValue == "string" ? ( // pathValue is the selected topics ID
                        <div>
                            {pathValue}
                        </div>
                    ) : topicsArray.length == 0 ? (
                        <div className="p-2 md:p-10 flex flex-wrap gap-5">
                            {
                                prebuiltData.map((data, index) => (
                                    <div key={index} className={`border border-[${theme.sideNav}] shadow-md rounded-md
                                        p-5 flex flex-col items-center gap-4 cursor-pointer hover:-translate-y-1
                                        hover:shadow-lg w-fit h-full flex-grow text-transparent`}>
                                
                                        <div className="flex flex-col gap-1 w-full">
                                            <span className={`text-2xl bg-[${theme.sideNav}]`}>{data.title}</span>
                                            <span className={`font-thin opacity-50 bg-[${theme.sideNav}]`}>{data.subtitle}</span>
                                        </div>
                                        <hr className={`w-[80%] border-[${theme.sideNav}]`} />
                                        <div className="text-xs font-thin opacity-50 w-full gap-1 flex flex-col">
                                            {data.items.map((item, idx) => (
                                              <div key={idx} className={`flex flex-row gap-2 bg-[${theme.sideNav}]`}>
                                                <RxCaretRight className="translate-y-[1px] min-w-[12px]" size={12}/>{item}
                                              </div>
                                            ))}
                                        </div>
                                    </div>
                                  ))
                            }
                        </div>
                    ) : (
                        <div className="p-2 md:p-10 flex flex-wrap gap-5">
                            {
                                Object.keys(pathValue??{}).map((subject, index) => ( // pathValue is an object with subjects as keys
                                    //<Link className="flex flex-grow" key={index} to={`/topics/${pathArray.join("/")}${pathArray.join("/").endsWith("/") ? "" : "/"}${subject}`}>
                                        <div key={index} className={`border border-[${theme.sideNav}] shadow-md rounded-md
                                                    p-5 flex flex-col items-center gap-4 cursor-pointer hover:-translate-y-1
                                                    hover:shadow-lg flex-grow`}
                                             onClick={() => {
                                                 updatePath(`${pathArray.join("/")}${pathArray.join("/").endsWith("/") ? "" : "/"}${subject}`)
                                             }}>
                                            
                                            {
                                                typeof getNextPathValue(subject) == "string" ? (
                                                    <div className="flex flex-col gap-1 w-full items-center justify-center h-full">
                                                        <span className="text-2xl h-fit">{subject}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex flex-col gap-1 w-full">
                                                            <span className="text-2xl">{subject}</span>
                                                            <span className="font-thin opacity-50">{Object.keys(getNextPathValue(subject)??{}).length} Subtopics</span>
                                                        </div>
                                                        <hr className={`w-[80%] border-[${theme.sideNav}]`} />
                                                        <div className="text-xs font-thin opacity-50 w-full">
                                                            {
                                                                Object.keys(getNextPathValue(subject)??{}).slice(0, 3).map((topic, index) => (
                                                                    <div className="flex flex-row gap-2" key={index}><RxCaretRight className="translate-y-[1px] min-w-[12px]" size={12}/>{topic}</div>
                                                                ))
                                                            }
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    //</Link>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}