import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate URL format
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new Response(JSON.stringify({ error: 'Only http/https URLs are supported' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch the page
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch URL: ${res.status} ${res.statusText}` }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const html = await res.text();

    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const rawTitle = titleMatch
      ? titleMatch[1].trim().replace(/\s*[|–\-]\s*.+$/, '') // strip " | Site Name"
      : parsed.hostname;

    // Strip HTML
    const rawText = stripHtml(html);

    // If API key available, use Claude to clean up the extracted text
    if (process.env.ANTHROPIC_API_KEY && rawText.length > 200) {
      const truncated = rawText.substring(0, 12000);

      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `The following is raw text scraped from: ${url}

Clean this up for use as a marketing knowledge base entry. Remove navigation menus, cookie notices, ads, footers, and any repetitive/irrelevant content. Keep ONLY the valuable content: articles, email copy, marketing frameworks, strategies, swipe file material, headlines, bullets, etc.

Preserve all meaningful text verbatim. Use paragraph breaks to separate sections. Do not summarize — keep the full content.

RAW TEXT:
${truncated}`,
          },
        ],
      });

      const cleaned = response.content
        .filter((b) => b.type === 'text')
        .map((b) => (b as { type: 'text'; text: string }).text)
        .join('');

      return new Response(
        JSON.stringify({ title: rawTitle, content: cleaned.trim(), url }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: return raw stripped text (truncated)
    const content = rawText.substring(0, 8000);
    return new Response(
      JSON.stringify({ title: rawTitle, content, url }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[fetch-url]', err);
    const message = err instanceof Error ? err.message : 'Failed to fetch URL';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
