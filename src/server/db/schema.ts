// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  boolean,
  json,
  integer
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTableTopics = pgTableCreator(() => `rccrevision_topics`);
export const createTableTopicsData = pgTableCreator(() => `rccrevision_topics_data`);

export const createTableUsers = pgTableCreator(() => `rccrevision_users`);

export const topics = createTableTopics(
  "topics",
  {
    id: serial("id").primaryKey(),
    topicId: varchar("topic_id", { length: 256 }).notNull(),
    title: varchar("title", { length: 1024 }),
    path: varchar("path", { length: 2048 }),
    authorId: varchar("author_id", { length: 256 }),
    baseTopic: boolean("base_topic"),
    private: boolean("private"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);
export const topicsData = createTableTopicsData(
  "topicsData",
  {
    id: serial("id").primaryKey(),
    topicId: varchar("topic_id", { length: 256 }).notNull(),
    data: json("data"),
    comments: json("comments"),
    views: integer("views"),
    likes: integer("likes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);

export const users = createTableUsers(
  "users",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    likes: json("likes"),
    subscribedTopicIds: json("subscribed_topic_ids"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);