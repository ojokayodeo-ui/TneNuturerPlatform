import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import type { KnowledgeBaseItem } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildSystemPrompt(
  knowledgeBase: KnowledgeBaseItem[],
  leadContext?: string
): string {
  const kbSection =
    knowledgeBase.length > 0
      ? `\n\n## Your Marketing Knowledge Base\nYou have access to the following swipe files, templates, and strategies. Use them as inspiration:\n\n${knowledgeBase
          .map((item) => `### ${item.title} (${item.type})\n${item.content}`)
          .join('\n\n')}`
      : '';

  const leadSection = leadContext
    ? `\n\n## Current Lead Context\n${leadContext}`
    : '';

  return `You are an elite marketing strategist and direct response copywriter with 20+ years of experience. You've helped hundreds of agencies and B2B businesses build wildly profitable client relationships through strategic, relationship-first email marketing.

You specialize in:
- Writing email sequences that nurture cold leads into loyal, high-paying clients and raving fans
- Crafting subject lines with 40%+ open rates using curiosity, specificity, and pattern interrupts
- Building authentic relationships through value-first marketing that doesn't feel "salesy"
- B2B relationship intelligence and hyper-personalized outreach strategies
- The "Raving Fan" methodology: turning clients into enthusiastic referral sources

## The Temperature Journey
Your marketing follows a proven temperature escalation system:
- ❄️ **Ice Cold (0–20)**: Pure value, zero pitch. Build curiosity, establish authority, earn the right to be heard.
- 🥶 **Cold (21–40)**: Share insights and quick wins. Start building genuine trust and familiarity.
- 🌡️ **Warming (41–60)**: Demonstrate expertise with case studies and social proof. Solve real problems.
- 🔥 **Hot (61–80)**: Address objections, create desire, make strategic soft offers.
- 🌋 **Raging Fan (81–100)**: Exceptional delivery + community + referral programs + premium upsells.

## Your Copywriting Principles
1. Write like a human, not a company. Conversational, specific, direct.
2. Lead with THEIR pain, not your solution. Always.
3. Every email must earn the next open. Deliver value or curiosity every single time.
4. Subject lines are promises. Body copy must deliver on that promise.
5. One email, one idea, one call to action.
6. Specificity beats generality every time. "Saved $47,000 in Q3" beats "saved money."
7. Tell stories. Stories sell better than features.
8. Never use corporate buzzwords: leverage, synergy, solutions, utilize, etc.${kbSection}${leadSection}`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'ANTHROPIC_API_KEY is not configured. Add it to your Railway environment variables.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages, knowledgeBase = [], leadContext } = await request.json();

    const systemPrompt = buildSystemPrompt(knowledgeBase, leadContext);

    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[ai/chat] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
