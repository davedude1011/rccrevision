import { theme } from "../../style";

import { RiShoppingBag4Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import { addTopicData, addTopicPath, getSubscribedTopics } from "~/server/topicsData";
import { FiPlus } from "react-icons/fi";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { IoIosClose, IoIosVideocam } from "react-icons/io";
import { FaRegImage } from "react-icons/fa";
import { FaHeading } from "react-icons/fa6";
import { ImEmbed2 } from "react-icons/im";
import { GoInfo } from "react-icons/go";

import Switch from "react-switch";
import Creatable from 'react-select/creatable';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { SignInButton, useAuth } from "@clerk/clerk-react";
import { getUserSubscribedTopicIds, updateUserSubscribedTopicIds } from "~/server/users";
import Link from "next/link";

function PrimaryButton({ children, onClick, disabled }: { children: JSX.Element|string|number|Element|(JSX.Element|string|number|Element)[], onClick?: React.MouseEventHandler<HTMLButtonElement>, disabled?: boolean}) {
    return (
        <button className={`flex flex-row gap-2 bg-[${theme.sideNav}] rounded-md p-2 px-4 items-center ${disabled && "opacity-25"}`} disabled={disabled} onClick={onClick}>
            {children as never}
        </button>
    )
}

function generateRandomString(length = 20): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default function CreateTopicsBody() {
    const user = useAuth()
    
    const [baseTopicPaths, setBaseTopicPaths] = useState([] as string[])
    const [isFilterTopicPaths, setIsFilterTopicPaths] = useState(true)
    useEffect(() => {
        getSubscribedTopics(true)
           .then((data) => {
                setBaseTopicPaths(data as string[])
           })
           .catch((error) => console.error(error))
    }, [])
    function getIndexOfPaths(index: number) { // returns the value of each path at the given index, if it exists
        const tempArray = []
        for (const path of baseTopicPaths) {
            const pathArray = path.split("/")
            if (pathArray.length >= index+1) {
                if (isFilterTopicPaths) {
                    if (path.includes(topicData.path/*.replace(/\/+/g, '/')*/) || topicData.path == "") {
                        tempArray.push(pathArray[index])
                    }
                }
                else {
                    tempArray.push(pathArray[index])
                }
            }
        }
        return [...new Set(tempArray)]
    }

    const emptyTopicData = {
        title: "",
        path: "",
        content: [] as {type: string, src?: string, content?: string}[],
        videos: [] as string[],
        isPrivate: false,
    }
    const [topicData, setTopicData] = useState(emptyTopicData)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleTopicDataChange(key: string, newValue: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setTopicData((prevState) => ({...prevState, [key]: newValue }))
    }

    const [editorType, setEditorType] = useState("visual")
    const [tempJsonInput, setTempJsonInput] = useState("")
    function handeJsonInput(value: string) {
        setTempJsonInput(value)
    }

    function formatDataForServer() {
        return [
            [...topicData.content],
            ...topicData.videos
        ]
    }

    return (
        <>
            <div className="w-1/2 h-fit flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <span className="text-3xl font-semibold">Create Custom Topic</span>
                    <Link href={"/topic-marketplace"}>
                        <button className="flex flex-row gap-2 p-2 border rounded-md items-center opacity-65 hover:opacity-100 hover:px-6 transition-all"><RiShoppingBag4Line/>Topics Marketplace</button>
                    </Link>
                </div>
                <div className="flex flex-col border rounded-md p-4 gap-4">
                    <span className="text-2xl font-semibold">Topic Details</span>
                    <div className="flex flex-col">
                        <label htmlFor="topicTitle">Title</label>
                        <input type="text" placeholder="Enter topic title" id="topicTitle"
                               className="p-2 rounded-md border bg-transparent" value={topicData.title} onChange={(e) => {
                                handleTopicDataChange("title", e.target.value)
                               }} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="topicPath">Topic Path</label>
                        <div className="flex flex-col gap-2">
                            {
                                topicData.path.split("/").map((_, index) => (
                                    <div className="flex flex-row gap-2 items-center h-fit" key={index}>
                                        <div className="flex flex-grow h-fit">
                                            <Creatable isLoading={baseTopicPaths.length <= 0} className="bg-transparent text-black w-full" options={
                                                getIndexOfPaths(index).map((indexedPathSegment) => { return {label: indexedPathSegment, value: indexedPathSegment} })
                                            } onChange={(e) => {
                                                const tempCurrentPath = topicData.path.split("/")
                                                // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
                                                tempCurrentPath[index] = e?.value as string
                                                handleTopicDataChange("path", tempCurrentPath.join("/"))
                                            }} />
                                        </div>
                                        {
                                            index == topicData.path.split("/").length - 1 ? (
                                                <button className="h-full aspect-square hover:opacity-100 opacity-50 rounded-md flex justify-center items-center" onClick={() => {
                                                    const tempCurrentPath = topicData.path.split("/")
                                                    if (index == tempCurrentPath.length - 1) {
                                                        tempCurrentPath.splice(index, 1)
                                                        handleTopicDataChange("path", tempCurrentPath.join("/"))
                                                    }
                                                }}>
                                                     <IoIosClose size={24} />
                                                </button>
                                            ) : (
                                                <div className="h-full aspect-square hover:opacity-100 opacity-50 rounded-md flex justify-center items-center"></div>
                                            )
                                        }
                                    </div>
                                ))
                            }
                            <div className="flex flex-row gap-4 justify-between">
                                <PrimaryButton disabled={baseTopicPaths.length <= 0} onClick={() => {handleTopicDataChange("path", topicData.path+"/")}}><FiPlus />Add Path Segment</PrimaryButton>
                                <div className="flex flex-row items-center gap-4">
                                    <div className="flex flex-row gap-2 items-center" onClick={() => {
                                        toast("Filters the displayed paths to pre-existing 'base' topics.", {
                                            autoClose: 10000
                                        })
                                    }}>
                                        <GoInfo className="cursor-pointer" />
                                        Filter paths
                                    </div>
                                    <Switch
                                        onChange={(checked) => setIsFilterTopicPaths(checked)}
                                        checked={isFilterTopicPaths}
                                        onColor={theme.sideNav}
                                        offColor="#ccc"
                                        onHandleColor="#ffffff"
                                        offHandleColor="#ffffff"
                                        checkedIcon={false}
                                        uncheckedIcon={false}>
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="flex flex-row items-center gap-4">
                            <Switch
                                onChange={(checked) => handleTopicDataChange("isPrivate", checked)}
                                checked={topicData.isPrivate}
                                onColor={theme.sideNav}
                                offColor="#ccc"
                                onHandleColor="#ffffff"
                                offHandleColor="#ffffff"
                                checkedIcon={false}
                                uncheckedIcon={false}>
                            </Switch>
                            <div className="flex flex-row items-center gap-2">{topicData.isPrivate ? "Private" : "Public"} topic {topicData.isPrivate ? <LuEyeOff /> : <LuEye />}</div>
                        </label>
                    </div>
                </div>
                <div className="flex flex-col border rounded-md p-4 gap-4">
                    <span>Content</span>
                    <div className="flex flex-row p-1 bg-[#ffffff10] w-fit rounded-md gap-2">
                        <button className={`text-sm ${editorType == "visual" && `bg-[${theme.body}]`} p-1 px-4 rounded-md`} onClick={() => setEditorType("visual")}>Visual Editor</button>
                        <button className={`text-sm ${editorType == "json" && `bg-[${theme.body}]`} p-1 px-4 rounded-md`} onClick={() => setEditorType("json")}>JSON Editor</button>
                    </div>
                    {
                        editorType == "visual" ? (
                            <>
                                {
                                    topicData.content.map(({type, src, content}, index) => (
                                        type == "header" ? (
                                            <div className="flex flex-col p-2" key={index}>
                                                <div className="flex flex-row justify-between items-center">
                                                    <label htmlFor={`header-${index}`}>Header</label>
                                                    <IoIosClose className="cursor-pointer" onClick={() => {
                                                        const tempTopicContent = topicData.content
                                                        tempTopicContent.splice(index, 1)
                                                        handleTopicDataChange("content", tempTopicContent)
                                                    }} />
                                                </div>
                                                <input type="text" id={`header-${index}`} value={topicData.content[index]?.content}
                                                className="p-2 rounded-md border bg-transparent"
                                                onChange={(e) => {
                                                    const tempTopicContent = topicData.content
                                                    if (tempTopicContent[index]) {
                                                        tempTopicContent[index].content = e.target.value
                                                        handleTopicDataChange("content", tempTopicContent)
                                                    }
                                                }} />
                                            </div>
                                        ) : type == "text" ? (
                                            <div className="flex flex-col p-2">
                                                <div className="flex flex-row justify-between items-center">
                                                    <label htmlFor={`header-${index}`}>Text</label>
                                                    <IoIosClose className="cursor-pointer" onClick={() => {
                                                        const tempTopicContent = topicData.content
                                                        tempTopicContent.splice(index, 1)
                                                        handleTopicDataChange("content", tempTopicContent)
                                                    }} />
                                                </div>
                                                <textarea id={`header-${index}`} value={topicData.content[index]?.content}
                                                className="p-2 rounded-md border bg-transparent"
                                                onChange={(e) => {
                                                    const tempTopicContent = topicData.content
                                                    if (tempTopicContent[index]) {
                                                        tempTopicContent[index].content = e.target.value
                                                        handleTopicDataChange("content", tempTopicContent)
                                                    }
                                                }} />
                                            </div>
                                        ) : type == "image" ? (
                                            <div className="flex flex-col p-2">
                                                <div className="flex flex-row justify-between items-center">
                                                    <label htmlFor={`header-${index}`}>Image</label>
                                                    <IoIosClose className="cursor-pointer" onClick={() => {
                                                        const tempTopicContent = topicData.content
                                                        tempTopicContent.splice(index, 1)
                                                        handleTopicDataChange("content", tempTopicContent)
                                                    }} />
                                                </div>
                                                <input type="text" id={`header-${index}`} value={topicData.content[index]?.src}
                                                className="p-2 rounded-md border bg-transparent"
                                                onChange={(e) => {
                                                    const tempTopicContent = topicData.content
                                                    if (tempTopicContent[index]) {
                                                        tempTopicContent[index].src = e.target.value
                                                        handleTopicDataChange("content", tempTopicContent)
                                                    }
                                                }} />
                                                <img src={topicData.content[index]?.src} className="mt-2 rounded-md max-w-[80%]" alt="" />
                                            </div>
                                        ) : type == "embed" ?  (
                                            <div className="flex flex-col p-2">
                                                <div className="flex flex-row justify-between items-center">
                                                    <label htmlFor={`header-${index}`}>Embed</label>
                                                    <IoIosClose className="cursor-pointer" onClick={() => {
                                                        const tempTopicContent = topicData.content
                                                        tempTopicContent.splice(index, 1)
                                                        handleTopicDataChange("content", tempTopicContent)
                                                    }} />
                                                </div>
                                                <input type="text" id={`header-${index}`} value={topicData.content[index]?.src}
                                                className="p-2 rounded-md border bg-transparent"
                                                onChange={(e) => {
                                                    const tempTopicContent = topicData.content
                                                    if (tempTopicContent[index]) {
                                                        tempTopicContent[index].src = e.target.value
                                                        handleTopicDataChange("content", tempTopicContent)
                                                    }
                                                }} />
                                                <div className="resize w-[80%] max-w-full aspect-video overflow-hidden flex">
                                                    <iframe src={topicData.content[index]?.src} className="mt-2 rounded-md flex-grow" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div></div>
                                        )
                                    ))
                                }
                                <div className="flex flex-row gap-2 flex-wrap">
                                    <PrimaryButton onClick={() => {console.log("hi"); handleTopicDataChange("content", [...topicData.content, {type: "header", content: ""}])}}><FaHeading />Header</PrimaryButton>
                                    <PrimaryButton onClick={() => {handleTopicDataChange("content", [...topicData.content, {type: "text", content: ""}])}}><FiPlus />Text</PrimaryButton>
                                    <PrimaryButton onClick={() => {handleTopicDataChange("content", [...topicData.content, {type: "image", src: ""}])}}><FaRegImage />Image</PrimaryButton>
                                    <PrimaryButton disabled><IoIosVideocam />Video</PrimaryButton>
                                    <PrimaryButton onClick={() => {handleTopicDataChange("content", [...topicData.content, {type: "embed", src: ""}])}}><ImEmbed2 />Embed</PrimaryButton>
                                </div>
                            </>
                        ) : (
                            <>
                                <textarea className="border p-2 rounded-md bg-transparent" rows={((JSON.stringify(topicData, null, 2)??"").split("\n")??"").length} value={JSON.stringify(topicData, null, 2)??""} onChange={(e) => {
                                    try {
                                        // eslint-disable-next-line
                                        setTopicData(JSON.parse(e.target.value)??"" as string)
                                    }
                                    catch {}
                                }}></textarea>
                            </>
                        )
                    }
                </div>
                <div className="flex flex-col border rounded-md p-4 gap-4">
                    <span>Main Videos</span>
                    <div className="flex flex-col gap-2">
                        <div className="w-full h-fit flex flex-col gap-2">
                            {
                                topicData.videos.map((_, index) => (
                                    <div className="flex flex-row justify-between w-full items-center gap-2" key={index}>
                                        <input type="text" id={`header-${index}`} value={topicData.videos[index]}
                                        className="p-2 rounded-md border bg-transparent flex flex-grow"
                                        placeholder="Video url"
                                        onChange={(e) => {
                                            const tempVideos = topicData.videos
                                            tempVideos[index] = e.target.value
                                            handleTopicDataChange("videos", tempVideos)
                                        }} />
                                        <div className="h-full aspect-square hover:opacity-100 opacity-50 rounded-md flex justify-center items-center">
                                            <IoIosClose size={24} className="cursor-pointer" onClick={() => {
                                                    const tempVideos = topicData.videos
                                                    tempVideos.splice(index, 1)
                                                    handleTopicDataChange("videos", tempVideos)
                                                }} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div>
                            <PrimaryButton onClick={() => {
                                handleTopicDataChange("videos", [...topicData.videos, ""])
                            }}><FiPlus />Add Main Video</PrimaryButton>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-end">
                    <button className="flex flex-row gap-2 p-2 border rounded-md items-center opacity-65 hover:opacity-100 hover:px-6 transition-all" onClick={() => {
                        if (user.isSignedIn) {
                            const randomTopicId = generateRandomString()
                            if (true) {
                                addTopicPath(`${topicData.path}/${topicData.title}`, randomTopicId, topicData.title)
                                    .then((response) => {console.log(response)})
                                    .catch((error: string) => {toast.error(error)})
                                
                                addTopicData(randomTopicId, formatDataForServer())
                                    .catch((error: string) => {toast.error(error)})
    
                                getUserSubscribedTopicIds()
                                    .then((userSubscribedTopicIds) => {
                                        updateUserSubscribedTopicIds(null, userSubscribedTopicIds ? [...userSubscribedTopicIds, randomTopicId] : [randomTopicId])
                                            .catch((error: string) => {toast.error(error)})
                                    })
                                    .catch((error: string) => {console.error(error)})
                            }
                            
                            toast.success("Topic published successfully!")
                            setTopicData(emptyTopicData)
                        }
                        else {
                            toast.error(
                                <>
                                    You need to <span className="text-blue-600 font-semibold"><SignInButton></SignInButton></span> to post custom topics to this site.
                                </>
                            )
                        }
                    }}>Publish Topic</button>
                </div>
            </div>
        </>
    )
}