import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import type { KnowledgeBaseItem, GeneratedSequence } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const {
      contact,
      sequenceType = 'cold_to_warm',
      emailCount = 5,
      tone = 'professional yet conversational',
      knowledgeBase = [] as KnowledgeBaseItem[],
    } = await request.json();

    const kbContext =
      knowledgeBase.length > 0
        ? `\n\nUse these swipe files and templates as inspiration:\n${knowledgeBase
            .map((item: KnowledgeBaseItem) => `[${item.title}]: ${item.content.substring(0, 500)}...`)
            .join('\n\n')}`
        : '';

    const journeyMap: Record<string, string> = {
      cold_to_warm: 'Ice Cold → Cold → Warming (pure value, build authority, no pitch)',
      warm_to_hot: 'Warming → Hot (demonstrate expertise, address objections, soft offer)',
      hot_to_client: 'Hot → Client (create urgency, remove friction, close)',
      client_to_fan: 'Client → Raging Fan (delight, over-deliver, referral activation)',
      full_journey: 'Ice Cold → Raging Fan (complete nurture journey)',
    };

    const journeyDescription = journeyMap[sequenceType] || journeyMap.cold_to_warm;

    const prompt = `Create a ${emailCount}-email nurture sequence for this prospect:

**Prospect Details:**
- Name: ${contact.name}
- Company: ${contact.company}
- Job Title: ${contact.jobTitle || 'Unknown'}
- Industry: ${contact.industry || 'Unknown'}
- Current Stage: ${contact.stage}
- Source: ${contact.source}
- Notes: ${contact.notes || 'None'}

**Sequence Type:** ${journeyDescription}
**Tone:** ${tone}${kbContext}

Return ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "name": "sequence name",
  "description": "brief description of the sequence strategy",
  "targetJourney": "temperature journey description",
  "emails": [
    {
      "step": 1,
      "name": "email name",
      "subject": "subject line",
      "body": "full email body with line breaks as \\n",
      "delayDays": 0,
      "goal": "what this email accomplishes"
    }
  ]
}

Rules:
- delayDays for step 1 is always 0
- Subsequent emails spaced 2-4 days apart
- Each email must be complete, ready-to-send copy
- Subject lines should be curiosity-driven or benefit-focused, under 50 chars
- Bodies should be 100-200 words max, conversational, specific
- Use [FIRST_NAME] as the personalization token
- No corporate jargon, no "I hope this email finds you well"
- Every email must earn the next open`;

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 8096,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract text from response
    let rawText = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        rawText += block.text;
      }
    }

    // Parse JSON - strip markdown code fences if present
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const sequence: GeneratedSequence = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(sequence), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[ai/generate-sequence] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sequence' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
