import Fuse from "fuse.js"
import { getSubscribedTopics } from "./topicsData"

export async function searchTopicsData(query: string, topicsData?: {
    id: number;
    topicId: string;
    title: string | null;
    path: string | null;
    authorId: string | null;
    baseTopic: boolean | null;
    private: boolean | null;
    createdAt: Date;
    updatedAt: Date | null;
}[]) {
    const topics = topicsData ?? await getSubscribedTopics()
    const fuse = new Fuse(topics as {
        id: number;
        topicId: string;
        title: string | null;
        path: string | null;
        authorId: string | null;
        baseTopic: boolean | null;
        private: boolean | null;
        createdAt: Date;
        updatedAt: Date | null;
    }[], {
        keys: ["title", "path"]
    })

    const results = fuse.search(query)
    return results.map((result) => ({title: (result.item?.title)??"", path: (result.item?.path)??""}))
}