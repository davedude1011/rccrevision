"use server"

import { eq, inArray, or, sql } from "drizzle-orm";
import { db } from "./db";
import { topics, topicsData, users } from "./db/schema";
import { getUserLikes } from "./users";
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

const subscribedTopicIds = [] as string[]

export async function getSubscribedTopics() {
  return await db.select().from(topics).where(
    or(
      eq(topics.baseTopic, true),
      inArray(topics.topicId, subscribedTopicIds),
    )
  )
}

export async function getFormattedData() {
  const topicsData = await getSubscribedTopics()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedData: Record<string, any> = {};

  for (const topic of topicsData) {
    const pathSections = topic.path?.split("/")
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
      currentLevel[lastPathSection] = topic.topicId
    }
  }

  return formattedData
}

const authorId = null

export async function addTopicPath(path: string, pathId: string) {
  await db.insert(topics).values({
    topicId: pathId,
    title: path.split("/").pop() ?? "FILE NAME NOT FOUND. PATH: "+path,
    path: path,
    authorId: authorId,
    baseTopic: true,
  })
}

/*export async function tempFunctionAddAllTopicPaths() {
  for (const path of pathArray) {
    await addTopicPath(path.path, path.pathId)
  }
}*/

export async function getTopicData(topicId: string, addView = true) {
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