"use client"

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

import { scrollBarStyle, theme } from "../style";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isMobile } from "react-device-detect";

import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react";
import { addUser, getUserData } from "~/server/users";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LuBookmark, LuCalendar, LuGalleryThumbnails, LuGraduationCap, LuHeadphones, LuSearch, LuShoppingBag, LuSliders, LuSparkles } from "react-icons/lu";

const sideNavData = [
    {
        title: "Search",
        link: "/search",
        icon: <LuSearch />,
    },
    {
        title: "Topics",
        link: "/topics",
        icon: <LuBookmark />,
    },
    /*
    {
        title: "Sparx Database",
        link: "/sparx-database",
        icon: <LuGalleryThumbnails />,
    },
    */
    {
        title: "Podcasts",
        newAudioComponentDataName: "podcasts",
        icon: <LuHeadphones />,
    },
    {
        title: "Interactables",
        link: "/interactables",
        icon: <LuSliders />,
    },
    {
        title: "Topic Marketplace",
        link: "/topic-marketplace",
        icon: <LuShoppingBag />,
    },
    {
        title: "Chatbot",
        link: "/chatbot",
        icon: <LuSparkles />,
    },
    {
        title: "Exam Practice",
        link: "/exam-practice",
        icon: <LuGraduationCap />,
    },
    {
        title: "Calendar",
        link: "/calendar",
        icon: <LuCalendar />,
    },
    /*
    {
        title: "Curriculum",
        link: "/curriculum",
        icon: <MdOutlineSchool />,
    }
        */
]

export default function SideNav({
    sideNavOut,
    setSideNavOut,
    audioComponentDataNames,
    setAudioComponentDataNames
}: {
    sideNavOut: boolean;
    setSideNavOut: (sideNavOut: boolean) => void;
    audioComponentDataNames: string[],
    setAudioComponentDataNames: (audioComponentDataNames: string[]) => void;
}) {
    const forceMobile = false;
    const pathname = usePathname()

    const [userData, setUserData] = useState(null as { username: string } | null)
    const user = useAuth();
    useEffect(() => {
        if (user.isSignedIn) {
            getUserData(user.userId ?? "")
                .then((userData: string) => setUserData(JSON.parse(userData) as { username: string }))
                .catch(error => console.log(error))
        }
    }, [])

    useEffect(() => {
        if (user.isSignedIn) {
            addUser()
                .catch(error => console.log(error))
        }
    }, [user])

    return (
        <>
            {
                (isMobile || forceMobile) &&
                    <button className="absolute top-0 left-0 m-4 text-white z-10" onClick={() => {
                        setSideNavOut(!sideNavOut)
                    }}>
                        <AiOutlineMenuUnfold size={24} />
                    </button>
            }
            <div className={`${
                sideNavOut ? ((isMobile || forceMobile) ? "w-screen absolute z-50" : "max-w-64 min-w-52 w-fit") : ((isMobile || forceMobile) ? "w-0" : "max-w-24 min-w-16 w-fit")
            } h-screen overflow-y-auto ${scrollBarStyle} bg-[${theme.sideNav}] text-[${theme.text}]
            flex flex-col transition-all overflow-x-hidden duration-100`}>
                <div className={`flex flex-row gap-5 items-center justify-between md:justify-start p-5 border-b border-[${theme.body}]`}>
                    {
                        sideNavOut && (
                            <Link href={"/"}>
                                <div className="text-2xl font-semibold">
                                    RccRevision
                                </div>
                            </Link>
                        )
                    }
                    <button className={`h-full aspect-square p-1 rounded-md hover:bg-[${theme.body}] opacity-80 hover:opacity-100`}
                            onClick={() => setSideNavOut(!sideNavOut)}>
                    {
                        sideNavOut ? (
                            <AiOutlineMenuFold size={24} />
                        ) : (
                            <AiOutlineMenuUnfold size={24} />
                        )
                    }
                    </button>
                </div>
                <div className={`w-full flex-1 p-5 flex flex-col ${!sideNavOut && "text-lg gap-[0.375rem]"}`}>
                    {
                        sideNavData.map(({ title, link, newAudioComponentDataName, icon }: { title: string, link?: string, newAudioComponentDataName?: string, icon: JSX.Element }, index) => (
                            <>
                                {
                                    link && (
                                        <Link
                                        href={{
                                            pathname: link,
                                        }} 
                                        prefetch={true}
                                        key={index} 
                                        onClick={() => {
                                            if (isMobile || forceMobile) {
                                                setSideNavOut(false)
                                            }
                                        }}>
                                            <button className={`${
                                                pathname.includes(link) ? `bg-[${theme.body}] opacity-100` : "opacity-50"
                                            } text-start p-2 rounded-md hover:bg-[${theme.body}] hover:opacity-100
                                            flex flex-row gap-2 items-center font-thin w-full`}>
                                                {icon}
                                                {sideNavOut && title}
                                            </button>
                                        </Link>
                                    )
                                }
                                {
                                    newAudioComponentDataName && (
                                        <button className={`${
                                            audioComponentDataNames.includes(newAudioComponentDataName) ? `bg-[${theme.body}] opacity-100` : "opacity-50"
                                        } text-start p-2 rounded-md hover:bg-[${theme.body}] hover:opacity-100
                                        flex flex-row gap-2 items-center font-thin w-full`} onClick={() => {
                                            if ((isMobile || forceMobile)) {
                                                toast.error("This feature is not currently available on mobile.")
                                            }
                                            else {
                                                if (audioComponentDataNames.includes(newAudioComponentDataName)) {
                                                    setAudioComponentDataNames(audioComponentDataNames.filter(name => name!== newAudioComponentDataName))
                                                }
                                                else {
                                                    setAudioComponentDataNames([...audioComponentDataNames, newAudioComponentDataName])
                                                }
                                            }
                                        }}>
                                            {icon}
                                            {sideNavOut && title}
                                        </button>
                                    )
                                }
                            </>
                        ))
                    }
                </div>
                <div className={`flex flex-row p-5 ${sideNavOut ? "justify-start" : "justify-center"} gap-2`}>
                    <SignedIn>
                        <UserButton />
                        <span className="opacity-50">
                            {
                                sideNavOut && userData != null ? userData.username : ""
                            }
                        </span>
                    </SignedIn>
                    <SignedOut>
                        {
                            sideNavOut &&
                                <span className="opacity-50 hover:opacity-100">
                                    <SignInButton />
                                </span>
                        }
                    </SignedOut>
                </div>
            </div>
        </>
    )
}