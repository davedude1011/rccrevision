import Link from "next/link";
import { bodyStyling, theme } from "../../style";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { IoMdNotificationsOutline } from "react-icons/io";
import { FiMinus, FiPlus } from "react-icons/fi";
import { CiBookmark } from "react-icons/ci";
import { useEffect, useState } from "react";
import { getCustomTopics } from "~/server/topicsData";
import { getFormattedUserData, updateUserSubscribedTopicIds } from "~/server/users";
import { PrebuiltTopicsNavigation } from "../topics/topicsNavigation";
import { isMobile } from "react-device-detect";

export default function TopicMarketplace() {
    const user = useAuth();

    const [searchValue, setSearchValue] = useState("")

    const [currentScreen, setCurrentScreen] = useState("publicTopics" as "publicTopics" | "subscribedTopics" | "myTopics")
    const [subscribedTopics, setSubscribedTopics] = useState([] as string[]);
    const [customTopics, setCustomTopics] = useState([] as {title: string, authorId: string, path: string, topicId: string, private: boolean}[]);
    const [userData, setUserData] = useState({} as Record<string, {profilePictureUrl: string, username: string, subscribedTopics: string[]}>)
    
    useEffect(() => {
        getCustomTopics()
           .then((data) => {
                setCustomTopics(data as {title: string, authorId: string, path: string, topicId: string, private: boolean}[])
           })
           .catch((error) => console.error(error))
        getFormattedUserData()
           .then((data) => {
                console.log(data)
                setUserData(data)
                setSubscribedTopics((data[user.userId??""]?.subscribedTopics)??[])
           })
           .catch((error) => console.error(error))
    }, [])

    const customTopicData = (
        (currentScreen == "publicTopics" ? (
            customTopics.filter(topic => !topic.private)
        ) : currentScreen == "subscribedTopics" ? (
            customTopics.filter(topic => subscribedTopics.includes(topic.topicId))
        ) : currentScreen == "myTopics" ? (
            customTopics.filter(topic => topic.authorId == user.userId)
        ) : []).filter((topic) => (
            searchValue.trim() == "" ??
            topic.title.toLowerCase().includes(searchValue.toLowerCase()) ??
            searchValue.toLowerCase().includes(topic.title.toLowerCase()) ??
            topic.path.toLowerCase().includes(searchValue.toLowerCase()) ??
            searchValue.toLowerCase().includes(topic.path.toLowerCase()) ??
            userData[topic.authorId]?.username.includes(searchValue.toLowerCase()) ??
            searchValue.toLowerCase().includes(userData[topic.authorId]?.username??"WHY AM I HERE?")
        ))
    )
    return (
        <div className={`${bodyStyling} py-8 flex flex-col items-center text-white`}>
            <div className="flex flex-col w-full gap-2 px-12">
                <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between md:items-end">
                    <div className="text-xl md:text-2xl font-bold">Topic Marketplace</div>
                    <div className="flex flex-row gap-2">
                        {/*<button><IoMdNotificationsOutline /></button>*/}
                        {
                            (!user?.isSignedIn) ? (
                                <button onClick={() => {
                                    toast.error(
                                        <>
                                            You need to <span className="text-blue-600 font-semibold"><SignInButton></SignInButton></span> to create topics.
                                        </>
                                    )
                                }} className="flex flex-row gap-2 p-2 border rounded-md items-center md:opacity-65 hover:opacity-100 md:hover:px-6 transition-all md:w-fit w-full"><FiPlus />Create new topics</button>
                            ) : (
                                isMobile ? (
                                    <button className="flex flex-row gap-2 p-2 border rounded-md items-center md:opacity-65 hover:opacity-100 md:hover:px-6 transition-all md:w-fit w-full" onClick={() => {
                                        toast.error("Currently, creating topics is only available for desktop users.", {autoClose: 15000})
                                    }}><FiPlus />Create new topics</button>
                                ) : (
                                    <Link href={"/topic-marketplace/create-topics"} className="md:w-fit w-full">
                                        <button className="flex flex-row gap-2 p-2 border rounded-md items-center md:opacity-65 hover:opacity-100 md:hover:px-6 transition-all md:w-fit w-full"><FiPlus />Create new topics</button>
                                    </Link>
                                )
                            )
                        }
                    </div>
                </div>
                <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search..." className="bg-transparent p-2 rounded-md border w-full"/>
                <div className="flex-row p-1 bg-[#ffffff10] w-fit rounded-md gap-2 md:flex hidden">
                    <button className={`text-sm ${currentScreen == "publicTopics" && `bg-[${theme.body}]`} p-1 px-4 rounded-md`} onClick={() => setCurrentScreen("publicTopics")}>Public Topics</button>
                    <button className={`text-sm ${currentScreen == "subscribedTopics" && `bg-[${theme.body}]`} p-1 px-4 rounded-md`} onClick={() => setCurrentScreen("subscribedTopics")}>Subscribed Topics</button>
                    <button className={`text-sm ${currentScreen == "myTopics" && `bg-[${theme.body}]`} p-1 px-4 rounded-md`} onClick={() => setCurrentScreen("myTopics")}>My Topics</button>
                </div>
                <div className="flex md:hidden flex-wrap gap-2">
                    <button className={`text-xs text-center flex flex-grow border ${currentScreen == "publicTopics" ? "opacity-100" : "opacity-50"} p-2 px-4 rounded-md`} onClick={() => setCurrentScreen("publicTopics")}>Public</button>
                    <button className={`text-xs text-center flex flex-grow border ${currentScreen == "subscribedTopics" ? "opacity-100" : "opacity-50"} p-2 px-4 rounded-md`} onClick={() => setCurrentScreen("subscribedTopics")}>Subscribed</button>
                    <button className={`text-xs text-center flex flex-grow border ${currentScreen == "myTopics" ? "opacity-100" : "opacity-50"} p-2 px-4 rounded-md`} onClick={() => setCurrentScreen("myTopics")}>Personal</button>
                </div>
            </div>
            <div className="flex flex-wrap gap-5 p-12">
                {
                    customTopics.length > 0 ? (
                        customTopicData.map(({title, path, authorId, topicId}, index) => (
                            <div key={index} className={`flex flex-grow h-fit p-5 rounded-md border flex-col gap-6 hover:opacity-100 ${subscribedTopics.includes(topicId) ? "opacity-100 shadow-xl" : "opacity-50"} hover:shadow-xl hover:-translate-y-1 transition-all group`}>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row justify-between items-center">
                                        <div className="text-xl font-semibold">{title}</div>
                                        {
                                            subscribedTopics.includes(topicId) && (
                                                <CiBookmark />
                                            )
                                        }
                                    </div>
                                    <div className={`text-xs font-thin w-fit p-2 px-4 opacity-50 bg-[${theme.sideNav}] rounded-full`}>{path}</div>
                                    {
                                        userData[authorId] && (
                                            <div className="flex flex-row gap-2 items-center">
                                                <img className="w-8 h-8 rounded-full object-cover" src={userData[authorId].profilePictureUrl}/>
                                                <span className="text-sm opacity-50">{userData[authorId].username}</span>
                                            </div>
                                        )
                                    }
                                </div>
                                    {
                                        user.isSignedIn ? (
                                            subscribedTopics.includes(topicId) ? (
                                                <button className="md:h-0 md:opacity-0 p-2 md:p-0 border md:border-none md:group-hover:opacity-50 md:hover:!opacity-100 md:hover:!px-4 md:hover:!gap-4 transition-all md:group-hover:p-2 md:group-hover:border rounded-md md:group-hover:h-fit flex flex-row w-full md:w-fit gap-2 text-base md:text-xs md:group-hover:text-base items-center" onClick={() => {
                                                    const tempSubscribedTopics = subscribedTopics.filter((id) => id != topicId)
                                                    setSubscribedTopics(tempSubscribedTopics)
                                                    updateUserSubscribedTopicIds(null, tempSubscribedTopics)
                                                        .catch((err) => console.error(err))
                                                }}>
                                                    <FiMinus />Remove
                                                </button>
                                            ) : (
                                                <button className="md:h-0 md:opacity-0 p-2 md:p-0 border md:border-none md:group-hover:opacity-50 md:hover:!opacity-100 md:hover:!px-4 md:hover:!gap-4 transition-all md:group-hover:p-2 md:group-hover:border rounded-md md:group-hover:h-fit flex flex-row w-full md:w-fit gap-2 text-base md:text-xs md:group-hover:text-base items-center" onClick={() => {
                                                    const tempSubscribedTopics = [...subscribedTopics, topicId]
                                                    setSubscribedTopics(tempSubscribedTopics)
                                                    updateUserSubscribedTopicIds(null, tempSubscribedTopics)
                                                        .catch((err) => console.error(err))
                                                }}>
                                                    <FiPlus />Add
                                                </button>
                                            )
                                        ) : (
                                            <button className="md:h-0 md:opacity-0 p-2 md:p-0 border md:border-none md:group-hover:opacity-50 md:hover:!opacity-100 md:hover:!px-4 md:hover:!gap-4 transition-all md:group-hover:p-2 md:group-hover:border rounded-md md:group-hover:h-fit flex flex-row w-full md:w-fit gap-2 text-base md:text-xs md:group-hover:text-base items-center" onClick={() => {
                                                toast.error(
                                                    <>
                                                        You need to <span className="text-blue-600 font-semibold"><SignInButton></SignInButton></span> to add custom topics to your collection.
                                                    </>
                                                )
                                            }}>
                                                <FiPlus />Add
                                            </button>
                                        )
                                    }
                            </div>
                        ))
                    ) : (
                        <PrebuiltTopicsNavigation />
                    )
                }
            </div>
        </div>
    )
}