import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllTables() {
  // Use a query that typically works in Supabase to list tables if possible, 
  // or just try common names.
  // Actually, we can try to fetch from a view that lists tables if it's exposed.
  // But usually it's not.
  
  // Let's try to use the 'rpc' to get table names if there's a helper.
  // If not, we'll just try to select from information_schema.tables if allowed.
  
  const { data, error } = await supabase.from('information_schema.tables').select('table_name').eq('table_schema', 'public');
  
  if (error) {
    console.error("Error listing tables:", error);
    return;
  }
  
  console.log("Tables in 'public' schema:");
  data.forEach(t => console.log(`- ${t.table_name}`));
}

listAllTables();
