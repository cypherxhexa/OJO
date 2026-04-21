import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  try {
    console.log("Pushing blog tables to Turso...");

    // Create BlogCategory table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "BlogCategory" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL
      )
    `);
    console.log("  ✓ BlogCategory table");

    await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "BlogCategory_name_key" ON "BlogCategory"("name")`);
    await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "BlogCategory_slug_key" ON "BlogCategory"("slug")`);
    console.log("  ✓ BlogCategory indexes");

    // Create BlogPost table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "BlogPost" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "excerpt" TEXT NOT NULL,
        "content" TEXT NOT NULL DEFAULT '',
        "coverImage" TEXT,
        "category" TEXT NOT NULL,
        "authorName" TEXT NOT NULL DEFAULT 'Editorial Team',
        "isPublished" BOOLEAN NOT NULL DEFAULT false,
        "isFeatured" BOOLEAN NOT NULL DEFAULT false,
        "views" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("  ✓ BlogPost table");

    await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug")`);
    console.log("  ✓ BlogPost indexes");

    // Create ContactMessage table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "ContactMessage" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("  ✓ ContactMessage table");

    console.log("✅ All tables pushed to Turso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
