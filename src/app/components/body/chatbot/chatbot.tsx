"use client"

import { clearUserHistory, getResponse, getUserHistory } from "~/server/gemini";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { type Content, type Part } from "@google/generative-ai";
import { LuSend, LuTrash } from "react-icons/lu";
import { getUserProfilePictureUrl } from "~/server/users";

import { Tooltip } from 'react-tooltip'

import { MathJax, MathJaxContext } from "better-react-mathjax"
import { mathJaxConfig } from "../../mathJaxConfig";

export default function ChatbotPage() {
    const user = useAuth()
    
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState([] as Content[])
    useEffect(() => { // hydrate messages on the page starting
        getUserHistory("chatbot-screen")
            .then((response) => {
                if (response) setMessages(response)
            })
            .catch((error) => {console.error("Error:", error)})
    }, [])
    function sendMessage() {
        if (user.isSignedIn) {
            const tempMessages = [...messages, {role: "user", parts: [{text: inputValue}]}]
            setMessages(tempMessages)
            getResponse("chatbot-screen", inputValue)
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
        //<MathJaxContext>
            //<MathJax>
                <div className="flex flex-col p-4 md:p-12 w-full h-full gap-8">
                    <Tooltip id="clear-button-tooltip" className="shadow-md">
                        This will clear all your current messages.
                    </Tooltip>
                    <div className="w-full flex-grow gap-8 flex flex-col">
                        {
                            messages.map(({role, parts}: {role: string, parts: Part[]}, index) => (
                                <div key={index} className={`flex ${role == "user" ? "flex-row-reverse" : "flex-row"} gap-4 `}>
                                    <img src={role=="user" ? userProfilePictureUrl : botProfilePictureUrl} className={`w-12 h-12 rounded-md object-cover ${role != "user" && "p-1"}`} />
                                    <div className="max-w-[66.66%]">
                                        <div className={`text-xs font-light flex ${role == "user" && "justify-end"}`}>{role == "user" ? "You" : "RccRevision-Bot"}</div>
                                        <MathJaxContext config={mathJaxConfig}>
                                            <MathJax>
                                                <div className="whitespace-pre-line">{parts[0]?.text}</div>
                                            </MathJax>
                                        </MathJaxContext>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="w-full flex flex-row md:px-32 gap-2">
                        <button data-tooltip-id="clear-button-tooltip" data-tooltip-place="top" className="aspect-square max-w-24 rounded-md border opacity-50 hover:opacity-100 transition-all flex items-center justify-center group" onClick={() => {
                            clearUserHistory("chatbot-screen")
                                .catch((error) => {console.log(error)})
                            setMessages([])
                        }}>
                            <LuTrash className="rotate-0 group-hover:rotate-12 transition-all"/>
                        </button>
                        <textarea className={`bg-transparent outline-none border rounded-md flex-grow resize-none hover:resize-y ${inputValue ? "opacity-100" : "opacity-50"} hover:opacity-100 focus:opacity-100 transition-all p-2`} value={inputValue} onChange={(e) => {
                            setInputValue(e.target.value)
                        }} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                sendMessage()
                                setInputValue("")
                            }
                        }} placeholder="Ask away..." rows={1} />
                        <button className="aspect-square max-w-24 rounded-md border opacity-50 hover:opacity-100 transition-all flex items-center justify-center group" onClick={() => {
                            sendMessage()
                            setInputValue("")
                        }}>
                            <LuSend className="-translate-x-[2px] translate-y-[2px] group-hover:translate-x-0 group-hover:translate-y-0 transition-all"/>
                        </button>
                    </div>
                </div>
            //</MathJax>
        //</MathJaxContext>
    )
}