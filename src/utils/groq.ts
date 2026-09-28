/**
 * Groq AI Client Integration for Winter Research Desk
 * Uses VITE_GROQ_API_KEY from .env
 * Gracefully degrades if offline or key is missing.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export const getGroqApiKey = (): string => {
  if (typeof window !== 'undefined') {
    // Check URL param first (e.g. ?groq_key=gsk_...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlKey = urlParams.get('groq_key');
      if (urlKey && urlKey.trim().startsWith('gsk_')) {
        localStorage.setItem('winter_groq_api_key', urlKey.trim());
        // Clean URL without refresh
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
        return urlKey.trim();
      }
    } catch {
      // ignore
    }

    const localKey = localStorage.getItem('winter_groq_api_key');
    if (localKey && localKey.trim().length > 10) {
      return localKey.trim();
    }
  }

  // Fallback to runtime environment variable if provided by host environment
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })['env'];
    const envKey = metaEnv ? metaEnv['VITE_' + 'GROQ_API_KEY'] : undefined;
    if (envKey && envKey.trim().startsWith('gsk_')) {
      return envKey.trim();
    }
  } catch {
    // ignore
  }

  return '';
};

export const setGroqApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    const clean = key.trim();
    if (clean) {
      localStorage.setItem('winter_groq_api_key', clean);
    } else {
      localStorage.removeItem('winter_groq_api_key');
    }
  }
};

export const isGroqAvailable = (): boolean => {
  const key = getGroqApiKey();
  return Boolean(key && key.trim().startsWith('gsk_'));
};

export interface GroqFeedbackResult {
  polishedText?: string;
  critique: string[];
  suggestions: string[];
  wordCountDelta?: string;
}

export async function reviewEmailDraft(
  subject: string,
  body: string,
  context?: { recipient: string; studentDegree: string; project: string }
): Promise<GroqFeedbackResult> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('Groq API Key not found. Please set VITE_GROQ_API_KEY in your .env file.');
  }

  const prompt = `You are a senior academic research advisor reviewing an Indian undergraduate student's winter research internship inquiry email.
Recipient: ${context?.recipient || 'Professor / Lab Director'}
Student background: ${context?.studentDegree || 'Undergraduate'}
Mentioned Project: ${context?.project || 'Student project'}

Subject Line:
"${subject}"

Email Body:
"""
${body}
"""

Strict Academic Guidelines to apply:
1. Academic emails must be CONCISE (under 180 words), honest, direct, and zero fluff.
2. Flag any hyperbolic buzzwords like "esteemed institution", "prestigious laboratory", "visionary", "esteemed director", "I hope this email finds you well".
3. Check that the student specifies exact winter availability dates and has a genuine link to code/report.
4. Check that their contribution is realistic (not claiming to revolutionize the field).
5. Suggest a slightly tighter, clearer version if needed.

Respond with ONLY valid JSON with this structure:
{
  "critique": ["point 1", "point 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "polishedText": "Cleaned up version of the email body preserving personal facts"
}`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an objective academic writing mentor. Always return raw valid JSON without markdown wrapping if possible.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  try {
    const parsed = JSON.parse(content);
    return {
      polishedText: parsed.polishedText,
      critique: Array.isArray(parsed.critique) ? parsed.critique : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
  } catch {
    return {
      critique: ['Could not parse structured critique.'],
      suggestions: [content],
    };
  }
}

export async function suggestResearchConnection(
  professorInterests: string,
  studentProject: string,
  studentSkills: string
): Promise<{ connectionIdea: string; relevantQuestion: string }> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('Groq API Key not found.');
  }

  const prompt = `Professor / Lab Research Interests:
"${professorInterests}"

Student's Project / Baseline:
"${studentProject}"

Student's Skills:
"${studentSkills}"

Generate ONE honest, realistic connection and ONE thoughtful technical observation/question a student could explore when reading the lab's papers.
Do not exaggerate. Avoid sycophancy.
Respond ONLY in JSON:
{
  "connectionIdea": "1-2 sentences on how student's project tooling connects to an aspect of the lab's work",
  "relevantQuestion": "One genuine, specific technical question regarding experimental setup, baseline, or limitation"
}`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an academic mentor. Output raw JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq request failed: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}
