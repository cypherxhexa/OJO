import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
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
    const sqlPath = path.join(process.cwd(), 'prisma', 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Pushing schema to Turso...");
    
    // Split SQL into individual statements for execution
    // Simple split by ; is usually enough for Prisma generated scripts
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await client.execute(statement);
    }

    console.log("✅ Success: Schema pushed to Turso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error pushing schema:", error);
    process.exit(1);
  }
}

main();
