import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Histori download untuk mempercepat akses jika URL yang sama diminta kembali
export const downloads = sqliteTable("downloads", {
  id: text("id").primaryKey(), // nanoid()
  url: text("url").notNull().unique(),
  title: text("title"),
  cover: text("cover"),
  author: text("author"),
  data: text("data").notNull(), // Menyimpan JSON stringified dari hasil API
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
