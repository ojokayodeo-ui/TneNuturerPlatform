import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import mammoth from 'mammoth';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop()?.toLowerCase();
    const rawTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    let content = '';

    // Plain text — just decode
    if (ext === 'txt' || ext === 'md') {
      content = buffer.toString('utf-8');
    }

    // Word document — use mammoth
    else if (ext === 'docx' || ext === 'doc') {
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    }

    // PDF — use Claude's native PDF reading
    else if (ext === 'pdf') {
      if (!process.env.ANTHROPIC_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'ANTHROPIC_API_KEY is required for PDF extraction.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const base64 = buffer.toString('base64');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfContent: any[] = [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 },
        },
        {
          type: 'text',
          text: 'Extract ALL text content from this document exactly as written. Preserve the structure — headings, bullet points, numbered lists, paragraphs. Do not summarize or interpret. Return only the raw text content.',
        },
      ];

      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 8096,
        messages: [{ role: 'user', content: pdfContent }],
      });

      content = response.content
        .filter((b) => b.type === 'text')
        .map((b) => (b as { type: 'text'; text: string }).text)
        .join('');
    } else {
      return new Response(
        JSON.stringify({ error: `Unsupported file type: .${ext}. Use PDF, DOCX, or TXT.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!content.trim()) {
      return new Response(
        JSON.stringify({ error: 'Could not extract any text from this file.' }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ title: rawTitle, content: content.trim() }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[extract-file]', err);
    return new Response(
      JSON.stringify({ error: 'Failed to extract file content.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
