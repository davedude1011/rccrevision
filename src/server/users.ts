"use server"

import { auth, clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
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
}

export async function getUserLikes(userId: string|null = null) {
    const user = auth()
    const userData = await db.select().from(users).where(eq(users.userId, userId??user.userId??""));
    if (userData.length > 0) {
        return userData[0]?.likes as string[];
    }
    return null
}

export async function getUserSubscribedTopicIds(userId: string|null = null) {
    const user = auth()
    const userData = await db.select().from(users).where(eq(users.userId, userId??user.userId??""));
    if (userData.length > 0) {
        return userData[0]?.subscribedTopicIds as string[];
    }
    return null
}

export async function updateUserSubscribedTopicIds(userId: string|null = null, topicIds: string[]) {
    const user = auth()
    await db.update(users).set({ subscribedTopicIds: topicIds }).where(eq(users.userId, userId??user.userId??""))
}

export async function getFormattedUserData() {
    const globalUserData = await db.select().from(users);
    
    // Create an array of promises to fetch user data in parallel
    const promises = globalUserData.map(async (user) => {
      try {
        const userData = await clerkClient.users.getUser(user.userId);
        return {
          userId: user.userId,
          profilePictureUrl: userData.imageUrl,
          username: userData.username ?? userData.firstName ?? "no username found",
          subscribedTopics: user.subscribedTopicIds as string[] ?? [] as string[],
        };
      } catch (error) {
        console.error(`Error fetching data for user ID ${user.userId}:`, error);
        return null; // or handle the error as you see fit
      }
    });
  
    // Wait for all promises to resolve
    const results = await Promise.all(promises);
  
    // Format the data into the desired structure
    const formattedData: Record<string, { profilePictureUrl: string; username: string, subscribedTopics: string[] }> = {};
    results.forEach((user) => {
      if (user) {
        formattedData[user.userId] = {
          profilePictureUrl: user.profilePictureUrl,
          username: user.username,
          subscribedTopics: user.subscribedTopics,
        };
      }
    });
  
    return formattedData;
  }

export async function getUserProfilePictureUrl(): Promise<string|undefined> {
  const user = auth()
  if (user?.userId) {
    const userData = await clerkClient.users.getUser(user.userId)
    return userData.imageUrl
  }
  return undefined
}