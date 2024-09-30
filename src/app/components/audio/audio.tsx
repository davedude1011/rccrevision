import { useEffect, useRef, useState } from "react";
import { getTrackBackground, Range } from "react-range";

import { TbPlayerSkipBack, TbPlayerSkipForward, TbPlayerPause, TbPlayerPlay, TbCaretUp, TbCaretDown } from "react-icons/tb";
import { theme } from "../style";
import { settings } from "../settings";

import podcastsData from "./podcasts.json"
import { GoMute, GoUnmute } from "react-icons/go";
import { IoIosClose } from "react-icons/io";

export default function AudioComponent({
    dataNames
}: {
    dataNames: string[]
}) {
    const contentData = dataNames.includes("podcasts") ? podcastsData as Record<string, {title: string, url: string}[]> : null;

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    function handlePlayPause(playAudio: boolean) {
        if (audioRef.current) {
            if (playAudio) audioRef.current.play().catch(error => console.log(error));
            else audioRef.current.pause();
        }
        setIsAudioPlaying(playAudio);
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.ontimeupdate = () => {
                if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                }
            }
        }
    }, [audioRef])

    const [componentSize, setComponentSize] = useState("compact" as "compact" | "open" | "full");
    const [thumbTimestampVisable, setThumbTimestampVisible] = useState(false);

    const [navSelectedSubject, setNavSelectedSubject] = useState("");

    const [activeSubject, setActiveSubject] = useState("");
    const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);

    useEffect(() => {
        if (contentData) {
            setActiveSubject(Object.keys(contentData)[0]??"")
            setNavSelectedSubject(Object.keys(contentData)[0]??"")
        }
    }, [contentData])

    const activeData = contentData?.[activeSubject]?.[activeSubjectIndex];

    const [volume, setVolume] = useState(100);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume])

    function handeNewAudioStart() {
        handlePlayPause(false)
        if (settings.functionality.audioComponentAutoPlay) {
            setTimeout(() => {
                handlePlayPause(true)
            }, 200)
        }
        if (audioRef.current) {
            audioRef.current.currentTime =  0;
        }
    }

    return (
        <>
            <audio ref={audioRef} src={activeData?.url}></audio>
            <div className={`absolute ${
                settings.ui.audioComponentAutoFade == "inactive" ? ((isAudioPlaying || componentSize == "full") ? "brightness-100 opacity-100" : "brightness-50 opacity-50 hover:opacity-100 hover:brightness-100") :
                settings.ui.audioComponentAutoFade == "always" ? "brightness-50 opacity-50" : 
                settings.ui.audioComponentAutoFade == "never" ? "brightness-100 opacity-100" : ""
            } transition-all inset-x-0 bottom-0 ${
                componentSize == "full" ? `h-full overflow-auto bg-[${theme.body}] justify-between` : `h-fit bg-gradient-to-t from-[${theme.body}] from-20%`
            } left-0 p-8 pt-12 flex flex-col gap-4 text-white`}>
                {
                    (componentSize == "open" || componentSize == "full") && (
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row justify-between">
                                <div className="flex-row p-1 bg-[#ffffff20] w-fit rounded-md gap-2 flex">
                                    {
                                        Object.keys(contentData??{}).map((subject, index) => (
                                            <button key={index} className={`text-sm ${navSelectedSubject == subject && `bg-[${theme.body}]`} p-1 px-4 rounded-md`} onClick={() => {
                                                setNavSelectedSubject(subject);
                                            }}>{subject}</button>
                                        ))
                                    }
                                </div>
                                <button className={`p-2 px-4 opacity-50 hover:opacity-100 hover:bg-[${theme.sideNav}] rounded-md transition-all`} onClick={() => {
                                    setComponentSize("compact");
                                }}>
                                    <IoIosClose size={24} />
                                </button>
                            </div>
                            <div className={`flex overflow-auto gap-2 ${
                                componentSize == "full" ? "flex-grow" : "max-h-36"
                            } ${
                                settings.ui.wrapAudioMenuItems? "flex-row flex-wrap" : "flex-col"
                            }`}>
                                {
                                    contentData?.[navSelectedSubject]?.map(({title}, index) => (
                                        <button className={`p-2 text-xl font-semibold border rounded-md ${
                                            (index == activeSubjectIndex && navSelectedSubject == activeSubject) ? "opacity-100" : "opacity-50 hover:opacity-100"
                                        } bg-[${theme.sideNav}] ${
                                            settings.ui.wrapAudioMenuItems ? "flex-grow w-fit text-center" : "text-start"
                                        } hover:-translate-y-[2px]`} onClick={() => {
                                            setActiveSubject(navSelectedSubject)
                                            setActiveSubjectIndex(index);
                                            handeNewAudioStart()
                                        }} key={index}>
                                            {title}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                <div className="flex flex-col gap-4">
                    <div className="w-full flex flex-row justify-between">
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col justify-end">
                                <div className="text-lg font-semibold">{activeData?.title}</div>
                                <div className="text-sm font-thin cursor-pointer hover:italic w-fit" onClick={() => setComponentSize("open")}>{activeSubject}</div>
                            </div>
                            {
                                (componentSize == "full" || componentSize == "open") && (
                                    <div className="flex flex-row gap-4 items-center">
                                        <button className={`p-2 px-4 opacity-50 hover:opacity-100 hover:bg-[${theme.sideNav}] rounded-md transition-all`} onClick={() => {
                                            if (volume == 0) {
                                                setVolume(50);
                                            }
                                            else {
                                                 setVolume(0);
                                            }
                                        }}>
                                            {
                                                (volume == 0) ? (
                                                    <GoMute />
                                                ) : (
                                                    <GoUnmute />
                                                )
                                            }
                                        </button>
                                        <div className="w-32">
                                            <Range
                                                min={0}
                                                max={100}
                                                values={[volume]}
                                                onChange={(values) => {
                                                    setVolume(values[0]??50);
                                                }}
                                                renderTrack={({ props, children }) => (
                                                <div
                                                    {...props}
                                                    style={{
                                                    ...props.style,
                                                    height: "6px",
                                                    width: "100%",
                                                    borderRadius: "50px",
                                                    background: getTrackBackground({
                                                        colors: ["#548BF4", "#ccc"],
                                                        min: 0,
                                                        max: 100,
                                                        values: [volume]
                                                    }),
                                                    }}
                                                >
                                                    {children}
                                                </div>
                                                )}
                                                renderThumb={({ props }) => (
                                                    <div
                                                    {...props}
                                                    key={props.key}
                                                    style={{
                                                        ...props.style,
                                                        height: "12px",
                                                        width: "12px",
                                                        borderRadius: "50%",
                                                        border: "2px solid #ccc",
                                                        backgroundColor: "#999",
                                                        outline: "none",
                                                    }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex flex-row items-end gap-4">
                            <button className={`p-2 rounded-lg hover:bg-[${theme.sideNav}] transition-all translate-y-2 group`} onClick={() => {
                                setComponentSize((componentSize == "open" || componentSize == "full") ? "compact" : "open")
                            }}>
                                {
                                    componentSize == "open" || componentSize == "full" ? (
                                        <TbCaretDown className={`opacity-50 group-hover:opacity-100 transition-all group-hover:translate-y-[2px]`} size={24} />
                                    ) : (
                                        <TbCaretUp className={`opacity-50 group-hover:opacity-100 transition-all group-hover:-translate-y-[2px]`} size={24} />
                                    )
                                }
                            </button>
                            <div className="flex flex-row items-end">
                                <button className={`p-2 px-6 rounded-lg hover:bg-[${theme.sideNav}] transition-all translate-y-2 group`} onClick={() => {
                                        setActiveSubjectIndex(
                                            activeSubjectIndex == 0 ? (contentData?.[navSelectedSubject]?.length??1) - 1 : activeSubjectIndex - 1
                                        )
                                        handeNewAudioStart()
                                    }}>
                                    <TbPlayerSkipBack className="opacity-50 group-hover:opacity-100 transition-all" size={24} />
                                </button>
                                <button className={`p-2 px-6 rounded-lg hover:bg-[${theme.sideNav}] transition-all translate-y-2 group`} onClick={() => {
                                    handlePlayPause(!isAudioPlaying);
                                }}>
                                    {
                                        isAudioPlaying? <TbPlayerPause className="opacity-50 group-hover:opacity-100 transition-all" size={24} /> : <TbPlayerPlay className="opacity-50 group-hover:opacity-100 transition-all" size={24} />
                                    }
                                </button>
                                <button className={`p-2 px-6 rounded-lg hover:bg-[${theme.sideNav}] transition-all translate-y-2 group`} onClick={() => {
                                    setActiveSubjectIndex(
                                        activeSubjectIndex == (contentData?.[navSelectedSubject]?.length??1) - 1 ? 0 : activeSubjectIndex + 1
                                    )
                                    handeNewAudioStart()
                                }}>
                                    <TbPlayerSkipForward className="opacity-50 group-hover:opacity-100 transition-all" size={24} />
                                </button>
                            </div>
                            <button className={`p-2 rounded-lg hover:bg-[${theme.sideNav}] transition-all translate-y-2 opacity-50 hover:opacity-100 transition-all"`} onClick={() => {
                                setComponentSize("full")
                            }}>
                                fullscreen
                            </button>
                        </div>
                    </div>
                    <div>
                        <Range
                            min={0}
                            max={audioRef.current?.duration??1}
                            values={[currentTime]}
                            onChange={(values) => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = (values[0]??0);

                                    if (!thumbTimestampVisable) setThumbTimestampVisible(true);
                                }
                            }}
                            onFinalChange={() => {
                                setThumbTimestampVisible(false);
                            }}
                            renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                style={{
                                ...props.style,
                                height: "6px",
                                width: "100%",
                                borderRadius: "50px",
                                background: getTrackBackground({
                                    colors: ["#548BF4", "#ccc"],
                                    min: 0,
                                    max: audioRef.current?.duration??1,
                                    values: [currentTime]
                                }),
                                }}
                            >
                                {children}
                            </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                {...props}
                                key={props.key}
                                style={{
                                    ...props.style,
                                    height: "12px",
                                    width: "12px",
                                    borderRadius: "50%",
                                    border: "2px solid #ccc",
                                    backgroundColor: "#999",
                                    outline: "none",
                                }}
                                >
                                    {
                                        thumbTimestampVisable &&
                                            <div style={{...props.style, translate: "calc(-50% + 4px)"}} className="-translate-y-[28px]">
                                                {
                                                    new Date(currentTime * 1000).toISOString().slice(11, 19).split(":").filter((value) => value != "00").join(":")
                                                }
                                            </div>
                                    }
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}