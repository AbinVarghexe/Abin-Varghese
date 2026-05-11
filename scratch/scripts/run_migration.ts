import postgres from "postgres";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL environment variable.");
  process.exit(1);
}

const sql = postgres(databaseUrl);

async function runMigration() {
  console.log("Reading migration file...");
  const migrationPath = path.resolve(process.cwd(), "supabase", "schema_achievements_linkedin.sql");
  const migrationSql = fs.readFileSync(migrationPath, "utf8");

  console.log("Running migration...");
  try {
    await sql.unsafe(migrationSql);
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sql.end();
  }
}

runMigration();
