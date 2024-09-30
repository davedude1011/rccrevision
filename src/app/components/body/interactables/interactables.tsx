"use client"

import { useState } from "react"
import { theme } from "../../style"

import StatesOfMatter from "./matterStates"
import MechanicalWaves from "./mechanicalWaves"
import { isMobile } from "react-device-detect"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export default function Interactables() {
    const [activeInteractable, setActiveInteractable] = useState(null as null|{
        data: () => {
            title: string;
            description: string;
            icon: JSX.Element;
            subject: string;
        };
        Visual: () => JSX.Element;
    })
    const interactables = [
        StatesOfMatter,
        MechanicalWaves
    ]
    return (
        <div className="w-full h-screen">
            {
                activeInteractable && (
                    <activeInteractable.Visual />
                )
            }
            <div className="flex flex-col p-12 md:w-1/2">
                <div className="flex flex-row gap-2 items-end justify-between">
                    <div className="text-5xl font-bold">Interactables</div>
                    <div className="text-sm font-thin opacity-50 hidden md:block">(beta feature)</div>
                </div>
                <div className="text-lg font-thin">Explore our collection of interactive learning tools. These interactables allow you to manipulate variables and observe how changes affect different systems in real-time.</div>
            </div>
            <div className="w-fit h-fit p-12 flex flex-wrap gap-6">
                {
                    interactables.map((interactable, index) => (
                        <div key={index} className="p-6 border rounded-md gap-6 flex flex-col flex-grow opacity-50 hover:opacity-100 transition-all items-center justify-between">
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex flex-row justify-between items-center gap-6">
                                    <div className="flex flex-row gap-2 items-center">
                                        {interactable.data().icon}
                                        <div className="text-2xl">{interactable.data().title}</div>
                                    </div>
                                    <div className={`bg-[${theme.sideNav}] px-4 py-1 rounded-full text-sm font-thin opacity-50`}>
                                        {interactable.data().subject}
                                    </div>
                                </div>
                                <div className="font-thin max-w-64">{interactable.data().description}</div>
                            </div>
                            <button onClick={() => {
                                if (isMobile) {
                                    toast.warn("Interactables are prone to breaking on Mobile, if you want a better experience use a desktop.")
                                }
                                setActiveInteractable(interactable)
                            }} className="p-2 border rounded-md opacity-50 hover:opacity-100 transition-all w-full hover:rounded-[50px] max-w-96">Open Interactable</button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}