import { BiSearch } from "react-icons/bi";
import { CiBookmark } from "react-icons/ci";
import { PiMathOperations } from "react-icons/pi";
import { FiHeadphones, FiSliders } from "react-icons/fi";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { AiOutlineFileText, AiOutlineRobot } from "react-icons/ai";
import { MdOutlineSchool } from "react-icons/md";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

import { scrollBarStyle, theme } from "../style";

const sideNavData = [
    {
        title: "Search",
        icon: <BiSearch />,
    },
    {
        title: "Topics",
        icon: <CiBookmark />,
    },
    {
        title: "Sparx Database",
        icon: <PiMathOperations />,
    },
    {
        title: "Podcasts",
        icon: <FiHeadphones />,
    },
    {
        title: "Interactables",
        icon: <FiSliders />,
    },
    {
        title: "Create Topics",
        icon: <VscGitPullRequestCreate />,
    },
    {
        title: "Chatbot",
        icon: <AiOutlineRobot />,
    },
    {
        title: "Past Papers",
        icon: <AiOutlineFileText />,
    },
    {
        title: "Curriculum",
        icon: <MdOutlineSchool />,
    }
]

export default function SideNav({
    sideNavOut,
    setSideNavOut,
    bodyElementName,
    setBodyElementName
}: {
    sideNavOut: boolean;
    setSideNavOut: (sideNavOut: boolean) => void;
    bodyElementName: string;
    setBodyElementName: (bodyElementName: string) => void;
}) {
    return (
        <div className={`${
            sideNavOut ? "max-w-64 min-w-52" : "max-w-24 min-w-16"
        } w-fit h-screen overflow-y-auto ${scrollBarStyle} bg-[${theme.sideNav}] text-[${theme.text}]
          flex flex-col transition-all overflow-x-hidden duration-100`}>
            <div className={`flex flex-row gap-5 items-center justify-start p-5 border-b border-[${theme.body}]`}>
                {
                    sideNavOut && (
                        <div className="text-2xl font-semibold">
                            RccRevision
                        </div>
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
            <div className={`w-full h-fit p-5 flex flex-col ${!sideNavOut && "text-lg gap-[0.375rem]"}`}>
                {
                    sideNavData.map(({ title, icon }, index) => (
                        <button key={index} className={`text-start p-2 rounded-md hover:bg-[${theme.body}] opacity-50 hover:opacity-100 flex flex-row gap-2 items-center font-thin`}
                                            onClick={() => setBodyElementName(title.toLowerCase())}>
                            {icon}
                            {sideNavOut && title}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}