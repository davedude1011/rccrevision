import { BiSearch } from "react-icons/bi";
import { CiBookmark } from "react-icons/ci";
import { PiMathOperations } from "react-icons/pi";
import { FiHeadphones, FiSliders } from "react-icons/fi";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { AiOutlineFileText, AiOutlineRobot } from "react-icons/ai";
import { MdOutlineSchool } from "react-icons/md";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

import { scrollBarStyle, theme } from "../style";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sideNavData = [
    {
        title: "Search",
        link: "/search",
        icon: <BiSearch />,
    },
    {
        title: "Topics",
        link: "/topics",
        icon: <CiBookmark />,
    },
    {
        title: "Sparx Database",
        link: "/sparx-database",
        icon: <PiMathOperations />,
    },
    {
        title: "Podcasts",
        link: "/podcasts",
        icon: <FiHeadphones />,
    },
    {
        title: "Interactables",
        link: "/interactables",
        icon: <FiSliders />,
    },
    {
        title: "Create Topics",
        link: "/create-topics",
        icon: <VscGitPullRequestCreate />,
    },
    {
        title: "Chatbot",
        link: "/chatbot",
        icon: <AiOutlineRobot />,
    },
    {
        title: "Past Papers",
        link: "/past-papers",
        icon: <AiOutlineFileText />,
    },
    {
        title: "Curriculum",
        link: "/curriculum",
        icon: <MdOutlineSchool />,
    }
]

export default function SideNav({
    sideNavOut,
    setSideNavOut,
}: {
    sideNavOut: boolean;
    setSideNavOut: (sideNavOut: boolean) => void;
}) {
    const pathname = usePathname()
    return (
        <div className={`${
            sideNavOut ? "max-w-64 min-w-52" : "max-w-24 min-w-16"
        } w-fit h-screen overflow-y-auto ${scrollBarStyle} bg-[${theme.sideNav}] text-[${theme.text}]
          flex flex-col transition-all overflow-x-hidden duration-100`}>
            <div className={`flex flex-row gap-5 items-center justify-start p-5 border-b border-[${theme.body}]`}>
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
            <div className={`w-full h-fit p-5 flex flex-col ${!sideNavOut && "text-lg gap-[0.375rem]"}`}>
                {
                    sideNavData.map(({ title, link, icon }, index) => (
                        <Link href={{
                            pathname: link,
                        }} prefetch={true} key={index}>
                            <button className={`${
                                pathname.includes(link) ? `bg-[${theme.body}] opacity-100` : "opacity-50"
                            } text-start p-2 rounded-md hover:bg-[${theme.body}] hover:opacity-100
                            flex flex-row gap-2 items-center font-thin w-full`}>
                                {icon}
                                {sideNavOut && title}
                            </button>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}