"use client"

import { useEffect, useState } from "react"
import { LuAlarmClock, LuChevronDown, LuChevronLeft, LuChevronRight, LuInfo, LuSettings2, LuShuffle, LuTrash, LuX } from "react-icons/lu"
import { TbPlaylistAdd } from "react-icons/tb"
import { MdOutlinePlaylistAddCheck } from "react-icons/md";

import Switch from "react-switch"
import { theme } from "../../style"
import Creatable from "react-select/creatable"

import paperData from "./paperData.json"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { isMobile } from "react-device-detect"

export default function ExamPractice() {
    const forceMobile = false;

    const [currentSubject, setCurrentSubject] = useState("Maths" as keyof typeof paperData)
    const [currentYear, setCurrentYear] = useState("November 2022" as keyof typeof paperData[typeof currentSubject])
    const [currentPaper, setCurrentPaper] = useState("Paper 1 Non-calculator (F)" as keyof typeof paperData[typeof currentSubject][typeof currentYear])
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const topicTitle = `${currentSubject} - ${currentYear} ${currentPaper}`

    const [shufflePaths, setShufflePaths] = useState([] as string[])

    const [questionNumber, setQuestionNumber] = useState(1)
    const [isShuffle, setIsShuffle] = useState(false)
    const [isTimer, setIsTimer] = useState(false)
    const [currentStopwatchTime, setCurrentStopwatchTime] = useState(0)

    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false)

    useEffect(() => {
        const stopWatchIntervel = setInterval(() => {
            if (isTimer) {
                setCurrentStopwatchTime(currentStopwatchTime + 1)
            }
        }, 1000)
        return () => clearInterval(stopWatchIntervel)
    }, [isTimer, setIsTimer, currentStopwatchTime, setCurrentStopwatchTime])

    const [isShufflePaths, setIsShufflePaths] = useState(false)

    function getDataFromPath(path: string|undefined, onlyImages = false): string[] {
        const pathSegments = path?.split("/")
        if (pathSegments?.length == 3) {
            const [subject, year, paper] = pathSegments
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return (
                // @ts-expect-error ok ok ok
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                onlyImages ? (paperData[subject][year][paper][1] ?? []) : paperData[subject][year][paper] ?? [] 
            )
        }
        return []
    }

    const data = (
        isShufflePaths ? (
            shufflePaths.flatMap((path) => 
                Array.from(getDataFromPath(path, true)).reverse()
            )
        ) : (
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            Array.from(getDataFromPath(`${currentSubject}/${currentYear}/${currentPaper}`, true)).reverse()
        )
    )

    const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false)
    
    return (
        <div className="w-full h-fit min-h-screen flex flex-row overflow-hidden">
            <div className="flex flex-col w-screen h-screen md:h-auto md:w-auto md:flex-grow p-12 gap-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 md:gap-2">
                    <div className="text-lg md:text-2xl">{topicTitle}</div>
                    <div className="flex flex-row justify-between md:justify-normal w-full md:w-fit items-center gap-4">
                        <div className="text-sm">Question {questionNumber} of {data.length}</div>
                        {
                            /*
                        <button className="flex flex-row text-sm items-center gap-2 p-2 border rounded-md opacity-50 hover:opacity-100 hover:shadow-md transition-all">
                            <LuDownload />
                            Export as PDF
                        </button>
                            */
                        }
                        {
                            isTimer && (
                                <div>
                                    {new Date(currentStopwatchTime * 1000).toISOString().slice(11, 19)}
                                </div>
                            )
                        }
                        {
                            (isMobile || forceMobile) && (
                                <button className="p-2 border rounded-md flex items-center justify-center opacity-75" onClick={() => {
                                    setIsMobileSettingsOpen(true);
                                }}>
                                    <LuSettings2 />
                                </button>
                            )
                        }
                    </div>
                </div>
                {
                    isShuffle && (
                        <div className="flex flex-row items-center gap-2 italic text-sm p-2 border opacity-50 hover:opacity-60 transition-all rounded-md w-fit">
                            <LuInfo />
                            Some questions may be part of a multi-part series. Alwase check adjacent questions for context.
                        </div>
                    )
                }
                <div className="flex flex-grow items-center justify-center">
                    <img src={`examPracticeImages/${data[questionNumber-1]}.webp`} className={`invert-[0.86] w-fit h-fit ${(isMobile || forceMobile) && "flex-grow"}`} alt="" />
                </div>
                <div className="flex flex-row justify-between">
                    {
                        isShuffle ? (
                            <div></div>
                        ) : (
                            <button className="flex flex-row p-2 pag-2 border rounded-md opacity-50 hover:opacity-100 hover:shadow-md items-center group transition-all px-4 hover:px-6" onClick={() => {
                                if (questionNumber == 1) setQuestionNumber(data.length)
                                else setQuestionNumber(questionNumber-1)
                             }}>
                                <LuChevronLeft className="group-hover:-translate-x-3 transition-all" />
                                Previous
                            </button>
                        )
                    }
                    <button className="flex flex-row p-2 pag-2 border rounded-md opacity-50 hover:opacity-100 hover:shadow-md items-center group transition-all px-4 hover:px-6" onClick={() => {
                        if (isShuffle) {
                            setQuestionNumber(
                                Math.floor(Math.random() * data.length) + 1
                            )
                        }
                        else {
                            if (questionNumber == data.length) setQuestionNumber(1)
                            else setQuestionNumber(questionNumber+1)
                        }
                     }}>
                        Next
                        <LuChevronRight className="group-hover:translate-x-3 transition-all" />
                    </button>
                </div>
            </div>
            <div className={`absolute ${
                isMobileSettingsOpen ? `translate-x-0 bg-[${theme.body}]` : "translate-x-full"
            } md:translate-x-0 md:relative flex flex-col w-screen h-screen md:h-auto md:w-auto md:flex-shrink p-12 gap-4 items-center shadow-md hover:shadow-xl transition-all max-h-screen`}>
                {
                    (isMobile || forceMobile) ? (
                        <div className="flex w-full flex-row justify-between">
                            <div className="text-2xl">Revision Settings</div>
                            <button className="p-2 border rounded-md flex items-center justify-center opacity-75" onClick={() => {
                                setIsMobileSettingsOpen(false);
                            }}>
                                <LuX />
                            </button>
                        </div>
                    ) : (
                        <div className="text-2xl">Revision Settings</div>
                    )
                }
                <div className="flex flex-col w-full h-fit gap-2">
                    <div>
                        <div>Subject</div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-row flex-grow">
                                <Creatable value={{label: currentSubject, value: currentSubject}} isLoading={!paperData} className="bg-transparent text-black w-full" options={
                                    Object.keys(paperData).map((subjectKey) => { return {label: subjectKey as keyof typeof paperData ?? "Maths", value: subjectKey as keyof typeof paperData ?? "Maths"} })
                                } onChange={(e) => {
                                    const tempShufflePaths = [...shufflePaths]
                                    tempShufflePaths[0] = `${
                                        e?.value ?? "Maths"
                                    }/${
                                        Object.keys(paperData[e?.value ?? "Maths"])[0] as keyof typeof paperData[typeof currentSubject] ?? "err"
                                    }/${
                                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                        Object.keys(paperData[e?.value ?? "Maths"][(Object.keys(paperData[e?.value ?? "Maths"])[0] as keyof typeof paperData[typeof currentSubject] ?? "err")])[0] as keyof typeof paperData[typeof currentSubject][typeof currentYear] ?? "err"
                                    }`
                                    setShufflePaths(tempShufflePaths)

                                    setQuestionNumber(1)

                                    setCurrentPaper(Object.keys(paperData[e?.value ?? "Maths"][(Object.keys(paperData[e?.value ?? "Maths"])[0] as keyof typeof paperData[typeof currentSubject] ?? "err")])[0] as keyof typeof paperData[typeof currentSubject][typeof currentYear] ?? "err")
                                    setCurrentYear(Object.keys(paperData[e?.value ?? "Maths"])[0] as keyof typeof paperData[typeof currentSubject] ?? "err")

                                    setCurrentSubject(e?.value ?? "Maths")

                                    console.log(tempShufflePaths)
                                }} />
                            </div>
                            <button className="flex p-2 text-lg items-center justify-center border rounded opacity-50 hover:opacity-100 transition-all h-[38px] aspect-square" onClick={() => {
                                const parentArray = paperData[currentSubject]
                                const middleArray = Object.keys(parentArray)
                                let childArray = [] as string[]
                                for (const yearKey of middleArray) {
                                    console.log(yearKey)
                                    // @ts-expect-error ok ok ok
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                    childArray = [...childArray, ...Object.keys(paperData[currentSubject][yearKey]).map((childKey) => `${currentSubject}/${yearKey}/${childKey}`)]
                                }

                                setShufflePaths([...shufflePaths, ...childArray])

                                toast(`Added ${childArray.length} papers from ${currentSubject}/ to your Playlist.`)
                            }}><TbPlaylistAdd /></button>
                        </div>
                    </div>
                    <div>
                        <div>Year</div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-row flex-grow">
                                <Creatable value={{label: currentYear, value: currentYear}} isLoading={!paperData[currentSubject]} className="bg-transparent text-black w-full" options={
                                    Object.keys(paperData[currentSubject]).map((yearKey) => { return {label: yearKey as keyof typeof paperData[typeof currentSubject] ?? "err", value: yearKey as keyof typeof paperData[typeof currentSubject] ?? "err"} })
                                } onChange={(e) => {
                                    const tempShufflePaths = [...shufflePaths]
                                    tempShufflePaths[0] = `${
                                        currentSubject
                                    }/${
                                        e?.value ?? "err"
                                    }/${
                                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                        Object.keys(paperData[currentSubject][(Object.keys(paperData[currentSubject])[0] as keyof typeof paperData[typeof currentSubject] ?? "err")])[0] as keyof typeof paperData[typeof currentSubject][typeof currentYear] ?? "err"
                                    }`
                                    setShufflePaths(tempShufflePaths)

                                    setQuestionNumber(1)

                                    setCurrentPaper(Object.keys(paperData[currentSubject][(Object.keys(paperData[currentSubject])[0] as keyof typeof paperData[typeof currentSubject] ?? "err")])[0] as keyof typeof paperData[typeof currentSubject][typeof currentYear] ?? "err")
                                    setCurrentYear(e?.value ?? "November 2021")
                                }} />
                            </div>
                            <button className="flex p-2 text-lg items-center justify-center border rounded opacity-50 hover:opacity-100 transition-all h-[38px] aspect-square" onClick={() => {
                                const parentArray = paperData[currentSubject][currentYear]
                                const childArray = Object.keys(parentArray)
                                setShufflePaths([...shufflePaths, ...childArray.map((childKey) => `${currentSubject}/${currentYear}/${childKey}`)])

                                toast(`Added ${childArray.length} papers from ${currentSubject}/${currentYear}/ to your Playlist.`)
                            }}><TbPlaylistAdd /></button>
                        </div>
                    </div>
                    <div>
                        <div>Paper</div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-row flex-grow">
                                <Creatable value={{label: currentPaper, value: currentPaper}} isLoading={!paperData[currentSubject][currentYear]} className="bg-transparent text-black w-full" options={
                                    Object.keys(paperData[currentSubject][currentYear]).map((paperKey) => { return {label: paperKey as keyof typeof paperData[typeof currentSubject][typeof currentYear] ?? "err", value: paperKey as keyof typeof paperData[typeof currentSubject][typeof currentYear] ?? "err"} })
                                } onChange={(e) => {
                                    const tempShufflePaths = [...shufflePaths]
                                    tempShufflePaths[0] = `${
                                        currentSubject
                                    }/${
                                        currentYear
                                    }/${
                                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                        e?.value as keyof typeof paperData[typeof currentSubject][typeof currentYear] ?? "err"
                                    }`
                                    setShufflePaths(tempShufflePaths)

                                    setQuestionNumber(1)

                                    setCurrentPaper(e?.value as keyof typeof paperData[typeof currentSubject][typeof currentYear] ?? "err")
                                }} />
                            </div>
                            <button className="flex p-2 text-lg items-center justify-center border rounded opacity-50 hover:opacity-100 transition-all h-[38px] aspect-square" onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                setShufflePaths([...shufflePaths, `${currentSubject}/${currentYear}/${currentPaper}`])
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                toast(`Added ${currentSubject}/${currentYear}/${currentPaper} to your Playlist.`)
                            }}><TbPlaylistAdd /></button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div>Go to Question</div>
                    <input className="bg-transparent border p-2 rounded-md text-sm" type="number" value={questionNumber} onChange={(e) => {setQuestionNumber(Number(e.target.value))}} />
                </div>
                <br />
                <hr className="w-[85%] opacity-25" />
                <br />
                <div className="flex flex-row gap-4 items-center w-full">
                    <Switch
                        checked={isShuffle}
                        onChange={(checked) => {setIsShuffle(checked)}}
                        onColor={theme.sideNav}
                        offColor="#ccc"
                        onHandleColor="#ffffff"
                        offHandleColor="#ffffff"
                        checkedIcon={false}
                        uncheckedIcon={false}
                    ></Switch>
                    <div className="flex flex-row gap-2 items-center">
                        <LuShuffle />
                        <div>Shuffle</div>
                    </div>
                </div>
                <div className="flex flex-row gap-4 items-center w-full">
                    <Switch
                        checked={isTimer}
                        onChange={(checked) => {setIsTimer(checked); setCurrentStopwatchTime(0)}}
                        onColor={theme.sideNav}
                        offColor="#ccc"
                        onHandleColor="#ffffff"
                        offHandleColor="#ffffff"
                        checkedIcon={false}
                        uncheckedIcon={false}
                    ></Switch>
                    <div className="flex flex-row gap-2 items-center">
                        <LuAlarmClock />
                        <div>Timer</div>
                    </div>
                </div>
                <br />
                <hr className="w-[85%] opacity-25" />
                <br />
                <div className="flex flex-row gap-4 items-center w-full">
                    <Switch
                        checked={isShufflePaths}
                        onChange={(checked) => {setIsShufflePaths(checked)}}
                        onColor={theme.sideNav}
                        offColor="#ccc"
                        onHandleColor="#ffffff"
                        offHandleColor="#ffffff"
                        checkedIcon={false}
                        uncheckedIcon={false}
                    ></Switch>
                    <div className="flex flex-row gap-2 items-center">
                        <MdOutlinePlaylistAddCheck />
                        <div>Use Playlist</div>
                    </div>
                </div>
                <div className="flex flex-col w-full gap-2">
                    <button className={`flex flex-row justify-between transition-all border p-2 rounded-md ${
                        (isShufflePaths && isPlaylistOpen) ? "opacity-100" :
                        isShufflePaths ? "opacity-50 hover:opacity-100" : "cursor-default opacity-25"
                    } items-center`} onClick={() => {
                        if (isShufflePaths) setIsPlaylistOpen(!isPlaylistOpen)
                    }}>Playlist {
                        isPlaylistOpen ? <LuChevronDown /> : <LuChevronRight />
                    }</button>
                </div>
                {
                    isShufflePaths && isPlaylistOpen && (
                        <div className="flex w-full flex-grow overflow-y-scroll border rounded-md opacity-100 p-2 flex-col">
                            {
                                shufflePaths.map((path, index) => (
                                    <div key={index} className="flex flex-row gap-2">
                                        <button className="text-sm opacity-80 hover:opacity-100" onClick={() => {
                                            setShufflePaths(shufflePaths.filter((_, i) => i!== index))
                                            toast(`Removed ${path} from your Playlist.`)
                                        }}>
                                            <LuTrash />
                                        </button>
                                        <div className="opacity-35">{path}</div>
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