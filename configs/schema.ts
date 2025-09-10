import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),

});

export const AiThumbnail=pgTable('thumbnails',{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    userInput:varchar(),
    thumbnailURL:varchar(),
    refImage:varchar(),
    userEmail:varchar().references(()=>usersTable.email),
    createdOn:varchar(),

})

export const AiContentTable=pgTable('AiContent',{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    userInput:varchar(),
    content:json(),
    thumbnailURL:varchar(),
    userEmail:varchar().references(()=>usersTable.email),
    createdOn:varchar(),

});

export const TrendingKeywordsTable=pgTable('trendingKeyWords',{
      id:integer().primaryKey().generatedAlwaysAsIdentity(),
    userInput:varchar(),
    keywordsData:json(),
    
    userEmail:varchar().references(()=>usersTable.email),
    createdOn:varchar(),

})