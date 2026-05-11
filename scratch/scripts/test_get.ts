import { getAchievements } from "../../src/lib/achievements";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testGet() {
  try {
    const data = await getAchievements();
    console.log("Achievements data:", data);
  } catch (error) {
    console.error("Error in testGet:", error);
  }
}

testGet();
