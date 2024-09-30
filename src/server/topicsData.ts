"use server"

import { eq, inArray, or, sql } from "drizzle-orm";
import { db } from "./db";
import { topics, topicsData, users } from "./db/schema";
import { getUserLikes, getUserSubscribedTopicIds } from "./users";
import { auth } from "@clerk/nextjs/server";
//import pathArray from "python/formatTopicsData/pathArray.json";
//import dataArray from "python/formatTopicsData/dataArray.json";

export async function getTopics(topicIds: string[]|null = null) {
  if (topicIds) {
    return await db.select().from(topics).where(
        inArray(topics.topicId, topicIds)
    )
  }
  return await db.select().from(topics)
}

export async function getSubscribedTopics(getPaths=false) {
  const subscribedTopicIds = await getUserSubscribedTopicIds()

  const subscribedTopics =  await db.select().from(topics).where(
    or(
      eq(topics.baseTopic, true),
      inArray(topics.topicId, subscribedTopicIds??[]),
    )
  )
  if (getPaths) {
    return subscribedTopics.map((topic) => { return topic.path })
  }
  return subscribedTopics
}

export async function getFormattedData() {
  const topicsData = await getSubscribedTopics()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedData: Record<string, any> = {};

  for (const topic of topicsData) {
    if (typeof topic != "string") {
      const pathSections = topic?.path?.split("/")
      if (pathSections && pathSections.length > 0) {
        let currentLevel = formattedData
        const lastPathSection = pathSections.pop() ?? "1"
        for (const pathSection of pathSections ?? []) {
          if (!currentLevel[pathSection]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            currentLevel[pathSection] = {}
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          currentLevel = currentLevel[pathSection]
        }
        currentLevel[lastPathSection] = topic?.topicId
      }
    }
  }

  return formattedData
}

export async function addTopicPath(path: string, pathId: string, title: string|null = null) {
  const user = auth()
  if (user.userId) {
    await db.insert(topics).values({
      topicId: pathId,
      title: title??path.split("/").pop() ?? "FILE NAME NOT FOUND. PATH: "+path,
      path: path,
      authorId: user.userId,
      baseTopic: false,
    })
    return "Successfully submitted topic path"
  }
  else {
    return null
  }
}

/*export async function tempFunctionAddAllTopicPaths() {
  for (const path of pathArray) {
    await addTopicPath(path.path, path.pathId)
  }
}*/

export async function getTopicData(topicId: string, addView=true) {
  if (addView) {
    await db.update(topicsData).set({ views: sql`${topicsData.views} + 1` }).where(eq(topicsData.topicId, topicId));
  }
  return await db.select().from(topicsData).where(eq(topicsData.topicId, topicId));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addTopicData(topicId: string, data: Record<string, any>) {
  await db.insert(topicsData).values({
    topicId: topicId,
    data: data,
    comments: [],
    views: 0,
    likes: 0,
  })
}

/*export async function tempFunctionAddAllTopicData() {
  for (const data of dataArray) {
    await addTopicData(data.pathId, data.value)
  }
}*/

export async function likeTopic(topicId: string) {
  const userLikes = await getUserLikes()
  const user = auth()
  if (user?.userId) {
    if (userLikes?.includes(topicId)) {
      await db.update(topicsData).set({ likes: sql`${topicsData.likes} - 1` }).where(eq(topicsData.topicId, topicId));
      await db.update(users).set({ likes: userLikes.filter((like) => like != topicId) }).where(eq(users.userId, user.userId));
    }
    else {
      await db.update(topicsData).set({ likes: sql`${topicsData.likes} + 1` }).where(eq(topicsData.topicId, topicId));
      await db.update(users).set({ likes: [...(userLikes??[]), topicId] }).where(eq(users.userId, user.userId));
    }
  }
}

export async function getLikedTopicsData() {
  const likedTopicIds = await getUserLikes()
  return getTopics(likedTopicIds)
}

export async function getCustomTopics() {
  return await db.select().from(topics).where(eq(topics.baseTopic, false))
}

export async function getRandomTopicsData() {
  function getRandomElements(arr: {
    id: number;
    topicId: string;
    title: string | null;
    path: string | null;
    authorId: string | null;
    baseTopic: boolean | null;
    private: boolean | null;
    createdAt: Date;
    updatedAt: Date | null;
}[] | (string | null)[], n: number) {
    const result = [];
    let len = arr.length;
    const taken = [...arr]; // Copy the array
    
    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * len);
        result.push(taken[randomIndex]);
        taken.splice(randomIndex, 1); // Remove element to avoid duplicates
        len--; // Reduce the pool size
    }
    
    return result;
  }

  const amountOfTopics = 10

  const randomTopicsData = [] as { title: string, subject: string, content: string }[]

  const subscribedTopics = await getSubscribedTopics()
  if (subscribedTopics) {
    const randomSubscribedTopics = getRandomElements(subscribedTopics, amountOfTopics)
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < randomSubscribedTopics.length; i++) {
      const topic = randomSubscribedTopics[i] as {title: string, topicId: string, path: string}
      if (topic.title && topic.topicId) {
        const topicData = await getTopicData(topic.topicId) as { data: [{type: string, content: string}[]] }[]
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const topicFirstText = (topicData.find((topic) => topic.data[0][1]?.type == "text")?.data[0][0]?.content)??undefined
        
        const subject = (topic.path.split("/")[0])??undefined
        
        if (topicFirstText && subject) {
          randomTopicsData.push({title: topic.title, subject: subject, content: topicFirstText})
          console.log({title: topic.title, subject: subject, content: topicFirstText})
        }
      }
    }
  }
  return randomTopicsData
}