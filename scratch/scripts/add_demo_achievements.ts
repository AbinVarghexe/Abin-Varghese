import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addDemoAchievements() {
  console.log("Checking for existing achievements...");
  const { count, error: countError } = await supabase
    .from("achievements")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("Error checking achievements:", countError);
    return;
  }

  console.log(`Found ${count} achievements.`);

  const demoAchievements = [
    {
      title: "NASA Space Apps 2025 Winner",
      description: "Awarded 'Best Mission Concept' at the NASA Space Apps Challenge for designing an innovative satellite data visualization tool.",
      date: "2025-05-01",
      category: "Award",
      image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
      external_link: "https://www.spaceappschallenge.org/",
      featured: true,
      order_index: 0
    },
    {
      title: "Smart India Hackathon 2024",
      description: "Won 1st prize in the national level hackathon for developing an AI-powered system for rural healthcare accessibility.",
      date: "2024-12-15",
      category: "Hackathon",
      image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
      external_link: "https://sih.gov.in/",
      featured: true,
      order_index: 1
    },
    {
      title: "Behance Interaction Gallery",
      description: "My project 'Astro UI' was featured in the curated Interaction Gallery on Behance, recognizing excellence in digital design.",
      date: "2024-08-20",
      category: "Recognition",
      image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
      external_link: "https://www.behance.net/",
      featured: true,
      order_index: 2
    },
    {
      title: "Google Summer of Code 2025",
      description: "Selected as a contributor for TensorFlow, working on performance optimization for mobile machine learning models.",
      date: "2025-03-10",
      category: "Open Source",
      image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
      external_link: "https://summerofcode.withgoogle.com/",
      featured: true,
      order_index: 3
    }
  ];

  console.log("Inserting demo achievements...");
  const { error: insertError } = await supabase
    .from("achievements")
    .insert(demoAchievements);

  if (insertError) {
    console.error("Error inserting achievements:", insertError);
  } else {
    console.log("Successfully added demo achievements.");
  }
}

addDemoAchievements();
