import OpenAI from 'openai';
import { z } from 'zod';

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  }
  return _openai;
}
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// ---- Input validation schema ----
export const RepurposeRequestSchema = z.object({
  content: z.string().min(10).max(50000).optional(),
  source_url: z.string().url().optional(),
  platforms: z.array(z.enum(['twitter', 'linkedin', 'reddit', 'email', 'instagram'])).min(1).max(5),
  tone: z.enum(['professional', 'casual', 'witty', 'authoritative', 'friendly']).default('professional'),
  language: z.string().default('en'),
  hashtags: z.boolean().default(true),
  thread: z.boolean().default(false), // For Twitter threads
}).refine(data => data.content || data.source_url, {
  message: 'Either "content" or "source_url" must be provided',
});

export type RepurposeRequest = z.infer<typeof RepurposeRequestSchema>;

// ---- Platform configs ----
const PLATFORM_SPECS: Record<string, { maxLength: number; instructions: string }> = {
  twitter: {
    maxLength: 280,
    instructions: `Create a tweet (max 280 chars). Be punchy, use a hook in the first line. Add 1-2 relevant hashtags at the end if hashtags are enabled. Use line breaks for readability. If "thread" mode is on, create a 3-5 tweet thread instead (each tweet max 280 chars, numbered 1/N format).`,
  },
  linkedin: {
    maxLength: 3000,
    instructions: `Create a LinkedIn post (max 3000 chars). Start with a strong hook line followed by a line break. Use short paragraphs (1-2 sentences each). Include a call-to-action at the end. Add 3-5 relevant hashtags at the bottom. Use a professional but engaging tone. Add occasional line breaks for readability.`,
  },
  reddit: {
    maxLength: 10000,
    instructions: `Create a Reddit post with a compelling title and body. The title should be attention-grabbing but not clickbait. The body should be informative, use markdown formatting (headers, bullet points, bold). Add a TL;DR at the end. Be authentic — Reddit users hate marketing speak.`,
  },
  email: {
    maxLength: 5000,
    instructions: `Create an email newsletter segment. Include a subject line, preview text (max 90 chars), and body. The body should have a clear structure: opening hook, 2-3 key points, and a CTA. Use short paragraphs. Format as JSON with fields: subject, preview_text, body.`,
  },
  instagram: {
    maxLength: 2200,
    instructions: `Create an Instagram caption (max 2200 chars). Start with an attention-grabbing first line (this shows in the preview). Use line breaks between paragraphs. Include a CTA. Add 15-20 relevant hashtags in a separate paragraph at the end. Use emojis sparingly for visual breaks.`,
  },
};

// ---- Core repurposing function ----
export async function repurposeContent(
  request: RepurposeRequest
): Promise<{ results: Record<string, any>; tokens_used: number; latency_ms: number }> {
  const start = Date.now();

  const sourceContent = request.content || `[Content from URL: ${request.source_url}]`;

  // Build the system prompt
  const systemPrompt = `You are a world-class content strategist and copywriter. Your job is to repurpose long-form content into platform-specific posts that feel native to each platform — not like rewritten blog posts.

Rules:
- Each output must feel like it was originally written for that platform
- Match the requested tone: "${request.tone}"
- Language: ${request.language}
- Hashtags: ${request.hashtags ? 'Include relevant hashtags' : 'Do not include hashtags'}
- Never mention that this was "repurposed" or "adapted" from other content
- Preserve the key insights and value from the original content
- Each platform output should highlight different angles/aspects when possible

Return a valid JSON object with platform names as keys. Each value should be a string (the post content), EXCEPT for "email" which should be an object with "subject", "preview_text", and "body" fields, and "reddit" which should be an object with "title" and "body" fields.${request.thread ? '\nFor Twitter: return an array of tweet strings instead of a single string.' : ''}`;

  // Build platform-specific instructions
  const platformInstructions = request.platforms
    .map(p => `### ${p.toUpperCase()}\n${PLATFORM_SPECS[p].instructions}\nMax length: ${PLATFORM_SPECS[p].maxLength} characters`)
    .join('\n\n');

  const userPrompt = `Repurpose the following content for these platforms: ${request.platforms.join(', ')}

${platformInstructions}

---
SOURCE CONTENT:
${sourceContent}
---

Return ONLY a valid JSON object. No markdown code fences. No explanation.`;

  const completion = await getOpenAI().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const tokensUsed = completion.usage?.total_tokens || 0;

  let results: Record<string, any>;
  try {
    results = JSON.parse(content);
  } catch {
    results = { error: 'Failed to parse LLM response', raw: content };
  }

  const latencyMs = Date.now() - start;

  return { results, tokens_used: tokensUsed, latency_ms: latencyMs };
}

/**
 * Fetch content from a URL (basic extraction)
 */
export async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'RepurposeAPI/1.0 (content extraction)' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    // Basic HTML to text extraction
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();

    // Truncate to ~8000 chars to stay within token limits
    return text.slice(0, 8000);
  } catch (error) {
    throw new Error(`Failed to extract content from URL: ${(error as Error).message}`);
  }
}
