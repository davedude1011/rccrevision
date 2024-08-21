import { MdOutlineSchool } from "react-icons/md"
import { FiSliders } from "react-icons/fi";
import { bodyStyling, theme } from "../../style";
import { IoBookOutline } from "react-icons/io5";
import { getFormattedData, getTopics } from "~/server/topicsData";
import { useEffect, useState } from "react";
import { RxCaretRight } from "react-icons/rx";

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

export default function TopicsNavigation() {
    const [topicsArray, setTopicsArray] = useState([])
    useEffect(() => {
        getFormattedData()
           .then((data) => {
                setTopicsArray(data as never)
                console.log(data)
           })
           .catch((error) => console.error(error))
    }, [])

    const [pathArray, setPathArray] = useState([] as string[]) // @ts-expect-error just deal with it ok...
    const pathValue = getValueAtPath(topicsArray, pathArray)
    function getNextPathValue(subject: string) {// @ts-expect-error idk what :never is so um idk
        return getValueAtPath(topicsArray, [...pathArray, subject])
    }

    return (
        <div className={`${bodyStyling} text-[${theme.text}] flex`}>
            <div className="w-full h-fit p-24 flex flex-col gap-2">
                <div className="w-full h-fit flex flex-row justify-between">
                    <span className="text-4xl">Topics</span>
                    <div className="flex flex-row gap-4 text-md">
                        {/*<button className={`flex flex-row gap-2 h-full rounded-md items-center px-2 border opacity-80 hover:opacity-100`}><FiSliders /> Toggle Options</button>*/}
                        <span className="flex flex-row gap-2 h-full items-center">RccRevision<MdOutlineSchool /></span>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2 text-md font-thin p-2 rounded-md">
                    <div className="flex flex-row items-center gap-2 cursor-pointer opacity-50 hover:opacity-100" onClick={() => setPathArray([])}>
                        <IoBookOutline />
                        <span>Subjects</span>
                    </div>
                    {
                        pathArray.map((subject, index) => (
                            <>
                                <RxCaretRight />
                                <div className="cursor-pointer opacity-50 hover:opacity-100" key={index} onClick={() => {
                                    setPathArray(pathArray.slice(0, pathArray.indexOf(subject) + 1))
                                }}>
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
                    ) : (
                        <div className="p-10 flex flex-wrap gap-5">
                            {
                                // @ts-expect-error shush please
                                Object.keys(pathValue).map((subject, index) => ( // pathValue is an object with subjects as keys
                                    <div key={index} onClick={() => {
                                        setPathArray([...pathArray, subject])
                                    }} className={`border border-[${theme.sideNav}] shadow-md rounded-md
                                                   p-5 flex flex-col items-center gap-4 cursor-pointer hover:-translate-y-1
                                                   hover:shadow-lg flex-grow`}>
                                        
                                        {
                                            typeof getNextPathValue(subject) == "string" ? (
                                                <div className="flex flex-col gap-1 w-full items-center justify-center h-full">
                                                    <span className="text-2xl h-fit">{subject}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1 w-full">
                                                    <span className="text-2xl">{subject}</span>
                                                    <span className="font-thin opacity-50">{Object.keys(getNextPathValue(subject)??{}).length} Subtopics</span>
                                                </div>
                                            )
                                        }
                                        {
                                            typeof getNextPathValue(subject) != "string" &&
                                            <>
                                                <hr className={`w-[80%] border-[${theme.sideNav}]`} />
                                                <div className="text-xs font-thin opacity-50 w-full">
                                                    {
                                                        Object.keys(getNextPathValue(subject)??{}).slice(0, 3).map((topic, index) => (
                                                            <div className="flex flex-row gap-2" key={index}><RxCaretRight className="translate-y-[1px] min-w-[12px]" size={12}/>{topic}</div>
                                                        ))
                                                    }
                                                </div>
                                            </>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}