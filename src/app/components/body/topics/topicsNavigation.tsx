"use client"

import { getFormattedData, getLikedTopicsData, getTopicData, likeTopic } from "~/server/topicsData";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { theme } from "../../style";
import { settings } from "../../settings";

import { isMobile } from "react-device-detect";
import { getUserLikes, getUserProfilePictureUrl } from "~/server/users";
import { SignedIn, SignedOut, SignIn, SignInButton, useAuth } from "@clerk/clerk-react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import AudioComponent from "../../audio/audio";

import topicsDictionary from "./topicsDictionary.json"

import { Tooltip } from 'react-tooltip'

import { MathJax, MathJaxContext } from "better-react-mathjax"
import { LuBookmark, LuChevronRight, LuEye, LuHeart, LuMessageSquare, LuSchool, LuSend, LuSparkles, LuTrash } from "react-icons/lu";
import { Content, Part } from "@google/generative-ai";
import { clearUserHistory, getResponse, getUserHistory } from "~/server/gemini";
import { FaHeart } from "react-icons/fa";
import { mathJaxConfig } from "../../mathJaxConfig";

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';


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
  ]

export function PrebuiltTopicsNavigation() {
    return (
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
                        <LuChevronRight className="translate-y-[1px] min-w-[12px]" size={12}/>{item}
                      </div>
                    ))}
                </div>
            </div>
          ))
    )
}

export function getTopicsDictionaryValue(word: string) {
    return (topicsDictionary as Record<string, {word: string, forms: string[], definition: string, wikipedia: string}>)[word.toLowerCase()]?? undefined
}


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
    const user = useAuth()

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
            path ? encodeURI(`/topics?path=${path}`.replaceAll("&", "AMPERSAND")) : "/topics",
        )
    }

    const searchParams = useSearchParams()
    useEffect(() => {
        const locationPath = decodeURI(searchParams.get("path")??"").replaceAll("AMPERSAND", "&")
        setPathArray(locationPath ? locationPath.split("/").filter(Boolean) : [])

        if (typeof getValueAtPath(topicsArray as never, pathArray) === "string") {
            getTopicData(getValueAtPath(topicsArray as never, pathArray)??"")
                .then((tempTopicData) => {
                    setTopicData(tempTopicData)
                    console.log(tempTopicData)
                })
                .catch((error) => console.error(error))
        }

        setTopicLikesOffset(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, topicsArray])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const [topicData, setTopicData] = useState(null as any)
    const [userLikes, setUserLikes] = useState([] as string[])
    //const [topicLikes, setTopicLikes] = useState("-" as string|number)
    function updateUserLikes() {
        getUserLikes()
            .then((likes) => setUserLikes(likes??[]))
            .catch((error) => console.error(error))
    }

    const [topicLikesOffset, setTopicLikesOffset] = useState(0 as number)

    useEffect(() => updateUserLikes, [])
    
    const [videoIndex, setVideoIndex] = useState(0)

    const [isLikedSection, setIsLikedSection] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const [likedTopicsData, setLikedTopicsData] = useState(null as any)
    function updateLikedTopicsData() {
        getLikedTopicsData()
           .then((data) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
                setLikedTopicsData(data as any)
           })
           .catch((error) => console.error(error))
    }
    useEffect(() => {updateLikedTopicsData()}, [])

    useEffect(() => {setTopicLikesOffset(0)}, [isLikedSection])

    const [dictionaryContentData, setDictionaryContentData] = useState(undefined as {
        word: string,
        forms: string[],
        definition: string,
        wikipedia: string,
    }|undefined)

    function formatContent(content: string) {
        const words = content.split(" ")
    
        function formatWord(word: string, index: number) {
            const wordData = getTopicsDictionaryValue(word)
            if (wordData) {
                return (
                    isMobile ? (
                        <a 
                            key={index}
                            className="text-blue-400 hover:underline cursor-pointer opacity-75"
                            onClick={() => {window.open(wordData.wikipedia)}}>{word} </a>
                    ) : (
                        <a 
                            key={index}
                            className="text-blue-400 hover:underline cursor-pointer opacity-75"
                            onClick={() => {window.open(wordData.wikipedia)}}
                            onMouseMove={() => {
                                setDictionaryContentData(wordData)
                            }}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-place="top">{word} </a>
                    )
                )
            }
            return <span key={index} className="opacity-50 font-thin">{word} </span>
        }
    
        return <>
            {
                words.map((word, index) => (
                    formatWord(word, index)
                ))
            }
        </>
    }

    const [geminiInputValue, setGeminiInputValue] = useState("")
    const [messages, setMessages] = useState([] as Content[])
    useEffect(() => { // hydrate messages on the page starting
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (user.isSignedIn && topicData?.[0]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            getUserHistory(topicData[0].topicId as string|undefined)
                .then((response) => {
                    if (response) setMessages(response)
                })
                .catch((error) => {console.error("Error:", error)})
        }
    }, [topicData, user.isSignedIn])
    function sendMessage(sessionPointer: string|undefined) {
        if (user.isSignedIn && sessionPointer) {
            const tempMessages = [...messages, {role: "user", parts: [{text: geminiInputValue}]}]
            setMessages(tempMessages)
            getResponse(sessionPointer, geminiInputValue, `This chat is occuring in ${pathArray.join("/")}, use this information to narrow your point of reference.`)
                .then((response) => {
                    if (response) {
                        setMessages([...tempMessages, {role: "model", parts: [{text: response}]}])
                    }
                    else {
                        toast.error(
                            <>
                                You need to <span className="text-blue-600 font-semibold"><SignInButton></SignInButton></span> to use our revision bot.
                            </>
                        )
                    }
                })
                .catch((error) => {console.error("Error:", error)})
        }
        else {
            toast.error(
                <>
                    You need to <span className="text-blue-600 font-semibold"><SignInButton></SignInButton></span> to use our revision bot.
                </>
            )
        }
    }
    
    const botProfilePictureUrl = "https://utfs.io/f/9686b7d0-c7a4-4e31-9eba-43e712d843be-ngnl8f.png"
    const [userProfilePictureUrl, setUserProfilePictureUrl] = useState(botProfilePictureUrl) // placeholder image
    useEffect(() => {
        getUserProfilePictureUrl()
            .then((imageUrl) => {
                if (imageUrl) setUserProfilePictureUrl(imageUrl)
            })
        .catch((error) => {console.log(error)})
    }, [])

    return (
        <>
            {
                !isMobile && (
                    <Tooltip opacity={1} style={{ backgroundColor: theme.body }} className="z-10 shadow-md" id="my-tooltip">
                        <div className="text-sm">{dictionaryContentData?.word}</div>
                        <div className="text-xs font-thin">{dictionaryContentData?.definition}</div>
                    </Tooltip>
                )
            }
            <div className="dictionary-content-container w-full h-fit p-6 md:p-24 flex flex-col gap-2">
                <div className="w-full h-fit flex flex-row justify-between">
                <span className="text-4xl">Topics</span>
                    <div className="flex flex-row gap-4 items-center justify-normal">
                        <button className="cursor-pointer flex flex-row text-md items-center hover:shadow-md opacity-50 hover:opacity-100 rounded-md p-2 px-4 gap-2 group"
                                onClick={() => {
                                    if (user.isSignedIn) {
                                        setIsLikedSection(!isLikedSection)
                                    }
                                    else {
                                        toast.error(
                                            <>
                                                You need to <span className="text-blue-600 font-semibold"><SignInButton></SignInButton></span> to keep track of your saved topics.
                                            </>
                                        )
                                    }
                                }}>
                            {
                                isLikedSection ? (
                                    <><LuBookmark />Subjects</>
                                ) : (
                                    <><LuHeart className="group-hover:text-pink-600 transition-all duration-500" />Liked Topics</>
                                )
                            }
                        </button>
                        <div className="md:flex flex-row gap-4 text-md hidden">
                            {/*<button className={`flex flex-row gap-2 h-full rounded-md items-center px-2 border opacity-80 hover:opacity-100`}><FiSliders /> Toggle Options</button>*/}
                            <Link href={"/"}>
                                <span className="flex flex-row text-md items-center hover:shadow-md opacity-50 hover:opacity-100 rounded-md p-2 px-4 gap-2"><LuSchool />RccRevision</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-2 text-sm md:text-md font-thin p-2 rounded-md">
                    <div className="flex flex-row items-center gap-2 cursor-pointer opacity-50 hover:opacity-100" onClick={() => updatePath("")}>
                        {
                            isLikedSection ? (
                                <><LuHeart />Liked topics</>
                            ) : (
                                <><LuBookmark />Subjects</>
                            )
                        }
                    </div>
                    {
                        !isLikedSection && pathArray.map((subject, index) => (
                            <>
                                <LuChevronRight key={index} />
                                <div className="cursor-pointer opacity-50 hover:opacity-100"
                                        onClick={() => updatePath(`${pathArray.slice(0, pathArray.indexOf(subject) + 1).join("/")}`)}>
                                    {subject}
                                </div>
                            </>
                        ))
                    }
                </div>
                <Suspense fallback={<PrebuiltTopicsNavigation />}>
                    {
                        isLikedSection && (
                            <div className="flex gap-5 flex-wrap">
                                {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                                    likedTopicsData?.map(({title, path, topicId}: {title: string, path: string, topicId: string}, index: number) => (
                                        <div key={index} className={`border border-[${theme.sideNav}] shadow-md rounded-md
                                        p-5 flex flex-col items-center gap-4 cursor-pointer hover:-translate-y-1
                                        hover:shadow-lg flex-grow ${settings.ui.topicsLeafRoundedFull && "rounded-full"}`}
                                        onClick={() => {
                                            setIsLikedSection(false)
                                            setPathArray(path.split("/"))
                                            getTopicData(topicId)
                                                .then((tempTopicData) => {
                                                    setTopicData(tempTopicData)
                                                    console.log(tempTopicData)
                                                })
                                                .catch((error) => console.error(error))
                                        }}>
                                            <div className="font-2xl">{title}</div>
                                            <hr className={`w-[80%] border-[${theme.sideNav}]`} />
                                            <div className="font-thin opacity-50">{path}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                    {
                        !isLikedSection &&
                        (typeof pathValue == "string" ? ( // display the content:
                            <div className="flex flex-col gap-4 w-full h-fit p-2 md:p-10">
                                <div className="flex flex-row justify-evenly md:justify-normal md:gap-12">
                                    <div className="flex flex-row gap-2 items-center">
                                        <LuEye />
                                        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                                        {topicData? topicData[0].views : "-"}
                                    </div>
                                    <div className="flex flex-row gap-2 items-center opacity-25 cursor-not-allowed">
                                        <LuMessageSquare />
                                        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                                        {topicData? topicData[0].comments.length : "-"}
                                    </div>
                                    <div className="flex flex-row gap-2 items-center group opacity-90 cursor-pointer"
                                            onClick={() => {
                                            if (user.isSignedIn) {
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                                                if (userLikes.includes((topicData??[{topicId:""}])[0].topicId)) {
                                                    setTopicLikesOffset(topicLikesOffset-1)
                                                }
                                                else {
                                                    setTopicLikesOffset(topicLikesOffset+1)
                                                }
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                                                likeTopic(topicData[0].topicId)
                                                    .then((_) => {updateLikedTopicsData()})
                                                    .catch((error) => console.error(error))
                                                updateUserLikes()
                                            }
                                            else {
                                                toast.error(
                                                    <>
                                                        You need to <span className="text-blue-600 font-semibold"><SignInButton></SignInButton></span> to like or comment on Topics.
                                                    </>
                                                )
                                            }
                                            }}>
                                            {
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                                                topicData && userLikes.includes((topicData)[0].topicId) ? (
                                                    <FaHeart className="text-pink-600" />
                                                ) : (
                                                    <LuHeart className="group-hover:text-pink-600" />
                                                )
                                            }
                                        
                                        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                                        <span className="group-hover:opacity-100">{topicData ? Math.abs((topicData[0].likes + topicLikesOffset) as number) : "-"}</span>
                                    </div>
                                </div>
                                {
                                    <div className="w-full h-fit flex flex-col">
                                        {        
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                                            (topicData ? topicData[0].data.slice(1, topicData[0].data.length??1) : []).map((link: string, index: number) => (
                                                <iframe key={index} src={link} className={`${index == videoIndex ? "" : "hidden"} w-full md:w-2/3 aspect-video rounded-md`} />
                                            ))
                                        }
                                        <div className="w-full md:w-2/3 h-10 flex flex-row gap-4 justify-center">
                                            {        
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                                                (topicData ? topicData[0].data.slice(1, topicData[0].data.length??1) : []).map((_: string, index: number) => (
                                                    <button key={index} className="h-full w-12 flex flex-col justify-center" onClick={() => {setVideoIndex(index)}}>
                                                        <div className={`w-full h-1 bg-white ${index == videoIndex ? "opacity-100" : "opacity-25" } rounded-full`}></div>
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                }
                                <Tooltip id="clear-button-tooltip" className="shadow-md">
                                    This will clear all your messages for {pathArray[pathArray.length -1]}
                                </Tooltip>
                                <div className="flex flex-col md:w-2/3 gap-8">
                                    <div className="flex flex-row p-2 items-center gap-2">
                                        <LuSparkles size={36} className="text-blue-500" />
                                        <div className="text-2xl">
                                            RccRevision-Bot
                                        </div>
                                        <SignedOut>
                                            <div></div>
                                            <div className="text-sm opacity-50">
                                                (You must be signed in to use this feature.)
                                            </div>
                                        </SignedOut>
                                    </div>
                                    <div className="w-full flex-grow gap-8 flex flex-col">
                                        <SignedIn>
                                            <MathJaxContext config={mathJaxConfig}>
                                                {
                                                    messages.map(({role, parts}: {role: string, parts: Part[]}, index) => (
                                                        <div key={index} className={`flex ${role == "user" ? "flex-row-reverse" : "flex-row"} gap-4 `}>
                                                            <img src={role=="user" ? userProfilePictureUrl : botProfilePictureUrl} className={`w-12 h-12 rounded-md object-cover ${role != "user" && "p-1"}`} />
                                                            <div className="max-w-[66.66%]">
                                                                <div className={`text-xs font-light flex ${role == "user" && "justify-end"}`}>{role == "user" ? "You" : "RccRevision-Bot"}</div>
                                                                    <MathJax>
                                                                        <div className="whitespace-pre-line">{parts[0]?.text}</div>
                                                                    </MathJax>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </MathJaxContext>
                                        </SignedIn>
                                        <SignedOut>
                                            <SignInButton></SignInButton>
                                        </SignedOut>
                                    </div>
                                    <div className="w-full flex flex-row gap-1 text-sm">
                                        <textarea className={`bg-transparent outline-none border rounded-md flex-grow resize-none hover:resize-y ${geminiInputValue ? "opacity-100" : "opacity-50"} hover:opacity-100 focus:opacity-100 transition-all p-2`} value={geminiInputValue} onChange={(e) => {
                                            setGeminiInputValue(e.target.value)
                                        }} onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                setGeminiInputValue("")
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                                sendMessage(topicData[0].topicId as string|undefined)
                                            }
                                        }} placeholder="Ask away..." rows={1} disabled={!user.isSignedIn} />
                                        <button data-tooltip-id="clear-button-tooltip" data-tooltip-place="top" className="aspect-square max-w-24 rounded-md border opacity-50 hover:opacity-100 transition-all flex items-center justify-center group" onClick={() => {
                                            setMessages([])
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                            clearUserHistory(topicData[0].topicId as string|undefined)
                                                .catch((error) => {console.log(error)})
                                        }} disabled={!user.isSignedIn}>
                                            <LuTrash className="rotate-0 group-hover:rotate-12 transition-all"/>
                                        </button>
                                        <button className="aspect-square max-w-24 rounded-md border opacity-50 hover:opacity-100 transition-all flex items-center justify-center group" onClick={() => {
                                            setGeminiInputValue("")
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                            sendMessage(topicData[0].topicId as string|undefined)
                                        }} disabled={!user.isSignedIn}>
                                            <LuSend className="-translate-x-[2px] translate-y-[2px] group-hover:translate-x-0 group-hover:translate-y-0 transition-all"/>
                                        </button>
                                    </div>
                                </div>
                                <MathJaxContext>
                                    <MathJax>
                                        {
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
                                            (topicData ? topicData[0]["data"][0] : []).map(({type, content, src}: {type: string, content: string, src: string}, index: number) => (
                                                type == "img" ? (
                                                    <img key={index} src={src} alt={src}
                                                            className="max-w-full md:max-w-[66.66%] rounded-md shadow-md" />
                                                ) : type == "text-list" ? (
                                                    <li className="font-thin w-full md:w-2/3">
                                                        {formatContent(content)}
                                                    </li>
                                                ) : type == "header" ? (
                                                    <div key={index} className="text-2xl font-bold mt-4">
                                                        {content}
                                                    </div>
                                                ) : type == "text" ? (
                                                    <div key={index} className="w-full md:w-2/3">
                                                        {formatContent(content)}
                                                    </div>
                                                ) : type == "pdf" ? (
                                                     <div key={index} className="w-full md:w-2/3">
                                                         <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                                            <Viewer fileUrl={"/pdf/" + content} />
                                                         </Worker>
                                                     </div>
 
                                                ) : null
                                            ))
                                        }
                                    </MathJax>
                                </MathJaxContext>
                            </div>
                        ) : topicsArray.length == 0 ? ( // display the skeleton
                            <div className="p-2 md:p-10 flex flex-wrap gap-5">
                                {
                                    <PrebuiltTopicsNavigation />
                                }
                            </div>
                        ) : ( // display the topics
                            <div className="p-2 md:p-10 flex flex-wrap gap-5">
                                {
                                    Object.keys(pathValue??{}).map((subject, index) => ( // pathValue is an object with subjects as keys
                                        //<Link className="flex flex-grow" key={index} to={`/topics/${pathArray.join("/")}${pathArray.join("/").endsWith("/") ? "" : "/"}${subject}`}>
                                            <div key={index} className={`border border-[${theme.sideNav}] shadow-md rounded-md
                                                        p-5 flex flex-col items-center gap-4 cursor-pointer hover:-translate-y-1
                                                        hover:shadow-lg flex-grow
                                                        ${typeof getNextPathValue(subject) == "string" && settings.ui.topicsLeafRoundedFull && "rounded-full"}`}
                                                onClick={async() => {
                                                    if (typeof getNextPathValue(subject) == "string") {
                                                        setTopicData(null)
                                                        getTopicData(getNextPathValue(subject)??"")
                                                            .then((tempTopicData) => {
                                                                setTopicData(tempTopicData)
                                                                console.log(tempTopicData)
                                                            })
                                                            .catch((error) => console.error(error))
                                                    }
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
                                                                        <div className="flex flex-row gap-2" key={index}><LuChevronRight className="translate-y-[1px] min-w-[12px]" size={12}/>{topic}</div>
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
                        ))
                    }
                </Suspense>
            </div>
        </>
    )
}