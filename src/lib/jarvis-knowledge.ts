/**
 * Jarvis Knowledge Ingestion & RAG Retrieval
 * Sources: GitHub API, PDF text, manual entries
 * Storage: Supabase pgvector (jarvis_knowledge table)
 */

import { createClient } from "@/utils/supabase/server";
import { embedText, embedBatch } from "@/lib/nvidia-nim";

// ── TYPES ────────────────────────────────────────────────────────────────────

export type KnowledgeSource = "github" | "linkedin_pdf" | "resume" | "manual";

export interface KnowledgeChunk {
  content: string;
  source: KnowledgeSource;
  metadata?: Record<string, string | number | boolean>;
}

export interface KnowledgeMatch {
  id: string;
  content: string;
  source: string;
  metadata: Record<string, string | number | boolean>;
  similarity: number;
}

// ── CHUNKING UTILITIES ───────────────────────────────────────────────────────

/**
 * Splits long text into overlapping chunks based on characters.
 * NVIDIA NIM (E5-v5) has a 512 token limit. 
 * 1000 characters is roughly 250 tokens, leaving plenty of room.
 */
export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 200
): string[] {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    if (chunk.trim().length > 20) {
      chunks.push(chunk.trim());
    }
    i += chunkSize - overlap;
  }

  return chunks;
}

// ── INGESTION ────────────────────────────────────────────────────────────────

/**
 * Ingest text chunks into the vector store
 */
export async function ingestKnowledge(chunks: KnowledgeChunk[]): Promise<{ inserted: number; errors: number }> {
  if (chunks.length === 0) return { inserted: 0, errors: 0 };

  const supabase = await createClient();
  const texts = chunks.map((c) => c.content);

  // Batch embed all chunks
  const embeddings = await embedBatch(texts);

  const rows = chunks.map((chunk, i) => ({
    content: chunk.content,
    embedding: JSON.stringify(embeddings[i]),
    source: chunk.source,
    metadata: chunk.metadata ?? {},
    updated_at: new Date().toISOString(),
  }));

  const { error, count } = await supabase
    .from("jarvis_knowledge")
    .insert(rows);

  if (error) {
    console.error("Jarvis Knowledge Ingest Error:", error);
    return { inserted: 0, errors: chunks.length };
  }

  return { inserted: count ?? rows.length, errors: 0 };
}

/**
 * Clear all knowledge from a specific source before re-ingesting
 */
export async function clearSource(source: KnowledgeSource): Promise<void> {
  const supabase = await createClient();
  await supabase.from("jarvis_knowledge").delete().eq("source", source);
}

// ── GITHUB INGESTION ─────────────────────────────────────────────────────────

export async function ingestGitHub(): Promise<{ inserted: number; errors: number }> {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const username = "AbinVarghexe";

  if (!token) throw new Error("GITHUB_PERSONAL_ACCESS_TOKEN not set");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  // Fetch user profile
  const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  const profile = await profileRes.json() as {
    name: string;
    bio: string;
    company: string;
    location: string;
    blog: string;
    public_repos: number;
    followers: number;
    following: number;
  };

  // Fetch repositories
  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=30&sort=updated`,
    { headers }
  );
  const repos = await reposRes.json() as {
    name: string;
    description: string | null;
    topics: string[];
    language: string | null;
    stargazers_count: number;
    html_url: string;
  }[];

  const chunks: KnowledgeChunk[] = [];

  // Profile chunk
  chunks.push({
    content: `Abin Varghese's GitHub Profile:
Name: ${profile.name || "Abin Varghese"}
Bio: ${profile.bio || "Front-end Developer"}
Company: ${profile.company || "Independent"}
Location: ${profile.location || "India"}
Website: ${profile.blog || "abinvarghese.com"}
Public Repositories: ${profile.public_repos}
GitHub Followers: ${profile.followers}`,
    source: "github",
    metadata: { type: "profile" },
  });

  // Repo chunks
  for (const repo of repos) {
    if (!repo.description && !repo.language) continue;
    chunks.push({
      content: `GitHub Project: ${repo.name}
Description: ${repo.description || "No description"}
Primary Language: ${repo.language || "Unknown"}
Topics/Tags: ${repo.topics?.join(", ") || "None"}
Stars: ${repo.stargazers_count}
URL: ${repo.html_url}`,
      source: "github",
      metadata: { type: "repository", repo: repo.name },
    });

    // Fetch README for key repos
    if (repo.stargazers_count > 0 || repo.topics?.length > 0) {
      try {
        const readmeRes = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/readme`,
          { headers }
        );
        if (readmeRes.ok) {
          const readmeData = await readmeRes.json() as { content: string };
          const readmeText = Buffer.from(readmeData.content, "base64").toString("utf-8");
          // Strip markdown syntax for cleaner embedding
          const cleanReadme = readmeText
            .replace(/#+\s*/g, "")
            .replace(/\*\*/g, "")
            .replace(/`[^`]+`/g, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .slice(0, 1000); // More aggressive cap

          if (cleanReadme.length > 50) {
            const readmeChunks = chunkText(cleanReadme, 800, 150);
            readmeChunks.forEach((chunk) => {
              chunks.push({
                content: `README for ${repo.name}: ${chunk}`,
                source: "github",
                metadata: { type: "readme", repo: repo.name },
              });
            });
          }
        }
      } catch {
        // README fetch optional — skip on failure
      }
    }
  }

  // Clear old GitHub data then re-ingest
  await clearSource("github");
  return ingestKnowledge(chunks);
}

// ── PDF / TEXT INGESTION ─────────────────────────────────────────────────────

/**
 * Ingest raw text (from PDF extraction or manual input)
 */
export async function ingestText(
  rawText: string,
  source: KnowledgeSource
): Promise<{ inserted: number; errors: number }> {
  const chunks = chunkText(rawText, 1000, 200);

  const knowledgeChunks: KnowledgeChunk[] = chunks.map((chunk, i) => ({
    content: chunk,
    source,
    metadata: { chunkIndex: i, totalChunks: chunks.length },
  }));

  await clearSource(source);
  return ingestKnowledge(knowledgeChunks);
}

// ── RAG RETRIEVAL ────────────────────────────────────────────────────────────

/**
 * Find the most relevant knowledge chunks for a user query
 */
export async function retrieveRelevantKnowledge(
  query: string,
  matchCount = 5,
  threshold = 0.5
): Promise<KnowledgeMatch[]> {
  const supabase = await createClient();
  const queryEmbedding = await embedText(query);

  const { data, error } = await supabase.rpc("match_jarvis_knowledge", {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: threshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("RAG Retrieval Error:", error);
    return [];
  }

  return (data ?? []) as KnowledgeMatch[];
}

// ── STATS ────────────────────────────────────────────────────────────────────

export interface KnowledgeStats {
  total: number;
  bySource: Record<string, number>;
  lastUpdated: string | null;
}

export async function getKnowledgeStats(): Promise<KnowledgeStats> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jarvis_knowledge")
    .select("source, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return { total: 0, bySource: {}, lastUpdated: null };
  }

  const bySource: Record<string, number> = {};
  for (const row of data) {
    bySource[row.source as string] = (bySource[row.source as string] ?? 0) + 1;
  }

  return {
    total: data.length,
    bySource,
    lastUpdated: data[0]?.updated_at as string | null ?? null,
  };
}
