import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import type { LeadAnalysis, LeadTemperatureLabel } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getTemperatureLabel(score: number): LeadTemperatureLabel {
  if (score <= 20) return 'Ice Cold';
  if (score <= 40) return 'Cold';
  if (score <= 60) return 'Warming';
  if (score <= 80) return 'Hot';
  return 'Raging Fan';
}

function getTemperatureEmoji(score: number): string {
  if (score <= 20) return '❄️';
  if (score <= 40) return '🥶';
  if (score <= 60) return '🌡️';
  if (score <= 80) return '🔥';
  return '🌋';
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { contact } = await request.json();

    const interactionSummary =
      contact.interactions?.length > 0
        ? contact.interactions
            .slice(-10)
            .map(
              (i: { type: string; sentAt: string; opened?: boolean; clicked?: boolean; replied?: boolean; subject?: string }) =>
                `- ${i.type} on ${i.sentAt}${i.opened ? ' (opened)' : ''}${i.clicked ? ' (clicked)' : ''}${i.replied ? ' (replied)' : ''}: ${i.subject || ''}`
            )
            .join('\n')
        : 'No interactions recorded yet.';

    const prompt = `Analyze this lead and determine their current temperature on a 0-100 scale.

**Lead Data:**
- Name: ${contact.name}
- Company: ${contact.company}
- Job Title: ${contact.jobTitle || 'Unknown'}
- Industry: ${contact.industry || 'Unknown'}
- Current Stage: ${contact.stage}
- Source: ${contact.source}
- Engagement Score: ${contact.engagementScore}/100
- Health Score: ${contact.healthScore}/100
- Last Contacted: ${contact.lastContactedAt}
- Is Client: ${contact.isClient}
- Contract Value: ${contact.contractValue ? `$${contact.contractValue}` : 'None'}
- Notes: ${contact.notes || 'None'}

**Recent Interactions:**
${interactionSummary}

Temperature Scale:
- 0–20: Ice Cold (no engagement, just a name)
- 21–40: Cold (aware but not engaged)
- 41–60: Warming (some engagement, building interest)
- 61–80: Hot (high engagement, considering buying)
- 81–100: Raging Fan (bought, loves us, advocates)

Return ONLY valid JSON (no markdown):
{
  "temperature": <number 0-100>,
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "personalizedHook": "a single compelling opening line for the next email to this person"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    });

    let rawText = '';
    for (const block of response.content) {
      if (block.type === 'text') rawText += block.text;
    }

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    const score: number = Math.min(100, Math.max(0, parsed.temperature));

    const analysis: LeadAnalysis = {
      contactId: contact.id,
      contactName: contact.name,
      temperature: score,
      temperatureLabel: getTemperatureLabel(score),
      temperatureEmoji: getTemperatureEmoji(score),
      insights: parsed.insights || [],
      recommendedActions: parsed.recommendedActions || [],
      personalizedHook: parsed.personalizedHook || '',
      analyzedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[ai/analyze-lead] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze lead' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
