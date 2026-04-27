/**
 * NVIDIA NIM API Client
 * Handles embeddings (nv-embedqa-e5-v5) and LLM (llama-3.3-70b-instruct)
 * Free tier: https://build.nvidia.com
 */

const NIM_BASE_URL = "https://integrate.api.nvidia.com/v1";

function getNimKey(): string {
  const key = process.env.NVIDIA_NIM_API_KEY;
  if (!key) throw new Error("NVIDIA_NIM_API_KEY is not set in .env.local");
  return key;
}

// ── EMBEDDING (1024 dims) ────────────────────────────────────────────────────

export async function embedText(text: string): Promise<number[]> {
  const key = getNimKey();

  const response = await fetch(`${NIM_BASE_URL}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nvidia/nv-embedqa-e5-v5",
      input: text,
      input_type: "query",
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`NIM Embed Error ${response.status}: ${err}`);
  }

  const data = await response.json() as { data: { embedding: number[] }[] };
  return data.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const key = getNimKey();
  const BATCH_SIZE = 16; // Safe limit for many embedding APIs
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    
    const response = await fetch(`${NIM_BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nv-embedqa-e5-v5",
        input: batch,
        input_type: "passage",
        encoding_format: "float",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`NIM Batch Embed Error ${response.status}: ${err}`);
    }

    const data = await response.json() as { data: { index: number; embedding: number[] }[] };
    const batchEmbeds = data.data
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
    
    allEmbeddings.push(...batchEmbeds);
  }

  return allEmbeddings;
}

// ── CHAT COMPLETION ──────────────────────────────────────────────────────────

export interface NimMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: NimMessage[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const key = getNimKey();

  const response = await fetch(`${NIM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta/llama-3.3-70b-instruct",
      messages,
      max_tokens: options?.maxTokens ?? 350,
      temperature: options?.temperature ?? 0.65,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`NIM Chat Error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "Neural sync failed.";
}
