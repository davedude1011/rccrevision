"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getUserData(userId: string) {
    return JSON.stringify(await clerkClient.users.getUser(userId));
}

export async function addUser(userId: string|null = null, force = false) {
    const user = auth()
    const userData = await db.select().from(users).where(eq(users.userId, userId??user.userId??""));
    if (userData.length == 0 || force) {
        await db.insert(users).values({
            userId: userId??user.userId??"",
            likes: [],
        })
    }
    console.log("USERDATA ", userData)
}

export async function getUserLikes(userId: string|null = null) {
    const user = auth()
    const userData = await db.select().from(users).where(eq(users.userId, userId??user.userId??""));
    if (userData.length > 0) {
        return userData[0]?.likes as string[];
    }
    return null
}