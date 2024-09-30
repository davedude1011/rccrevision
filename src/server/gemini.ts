"use server"

import { auth } from "@clerk/nextjs/server";
import { type ChatSession, type Content, GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./db";
import { geminiData } from "./db/schema";
import { eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY??"")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const trainingText = "you are a revision bot designed by rccrevision.com, your job is to tutor students who come to you, you live in rccrevision.com, you are powered by gemini 1.5 turbo, you have the ability to remember past conversations with the user, remember to format your responses, for example when listing things do a new line for each etc. when possible use mathjax for styling, the site will auto enterpret it to make it user readable VERY IMPORTANT DO NOT FORGET!"

async function getUserGeminiChatHistory(sessionPointer: string|undefined, optionalTrainingTextInjection?: string|undefined): Promise<Content[]|undefined> { // the session pointer acts as a split, each user will have different histories for every topic and the ai screen, the pointer acts as a dictionary key for each.
    const user = auth()
    if (user?.userId && sessionPointer) {
        const geminiUserData = await db.select().from(geminiData).where(eq(geminiData.userId, user.userId))
        const geminiGlobalChatHistory = geminiUserData[0]?.geminiChatHistory as Record<string, Content[]>|undefined
        const geminiChatHistory = geminiGlobalChatHistory?.[sessionPointer]
        if (geminiChatHistory) {
            return geminiChatHistory
        }
        else {
            const tempGlobalHistory = geminiGlobalChatHistory??{}
            const newChatHistory = [
                {
                    role: "user",
                    parts: [{ text: `${trainingText} ${optionalTrainingTextInjection??""}` }]
                }
            ]
            tempGlobalHistory[sessionPointer] = newChatHistory
            await db.insert(geminiData).values({
                userId: user.userId,
                geminiChatHistory: tempGlobalHistory
            })
            return newChatHistory
        }
    }
}
async function setUserGeminiChatHistory(sessionPointer: string|undefined, chat: ChatSession) {
    const user = auth()
    if (user?.userId && sessionPointer) {
        const geminiUserData = await db.select().from(geminiData).where(eq(geminiData.userId, user.userId))
        const geminiGlobalChatHistory = geminiUserData[0]?.geminiChatHistory as Record<string, Content[]>|undefined

        const chatHistory = (await chat.getHistory())?? []

        const tempGlobalHistory = geminiGlobalChatHistory??{}
        tempGlobalHistory[sessionPointer] = chatHistory

        await db.update(geminiData).set({ geminiChatHistory: tempGlobalHistory }).where(eq(geminiData.userId, user.userId))
    }
}

export async function getResponse(sessionPointer: string|undefined, prompt: string, optionalTrainingTextInjection?: string|undefined) {
    const user = auth()
    if (user?.userId && sessionPointer) {
        const history = await getUserGeminiChatHistory(sessionPointer, optionalTrainingTextInjection);
        if (history) {
            const chat = model.startChat({ history })

            const result = await chat.sendMessage(prompt)
            setUserGeminiChatHistory(sessionPointer, chat)
                .catch(err => console.log(err))

            return result.response.text()
        }
    }
    return undefined
}

export async function getUserHistory(sessionPointer: string|undefined): Promise<Content[]|undefined> {
    const user = auth()
    if (user?.userId && sessionPointer) {
        const geminiUserData = await db.select().from(geminiData).where(eq(geminiData.userId, user.userId))
        const geminiGlobalChatHistory = geminiUserData[0]?.geminiChatHistory as Record<string, Content[]>|undefined
        if (geminiGlobalChatHistory) {
            const geminiChatHistory = geminiGlobalChatHistory[sessionPointer]
            
            return geminiChatHistory?.filter((messageData: Content) => !messageData.parts[0]?.text?.includes(trainingText))
        }
    }
    return undefined
}

export async function clearUserHistory(sessionPointer: string|undefined) {
    const user = auth()
    if (user?.userId && sessionPointer) {
        const geminiUserData = await db.select().from(geminiData).where(eq(geminiData.userId, user.userId))
        const geminiGlobalChatHistory = geminiUserData[0]?.geminiChatHistory as Record<string, Content[]>|undefined

        const tempGlobalHistory = geminiGlobalChatHistory??{}
        tempGlobalHistory[sessionPointer] = []

        await db.update(geminiData).set({ geminiChatHistory: tempGlobalHistory }).where(eq(geminiData.userId, user.userId))
    }
}