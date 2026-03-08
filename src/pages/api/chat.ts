import type { APIRoute } from "astro";
import { SYSTEM_PROMPT } from "../../lib/system-prompt";
import { ENG_LEADER_SYSTEM_PROMPT } from "../../lib/eng-leader-system-prompt";
import type { ApiMessage, Persona } from "../../lib/types";

export const prerender = false;

interface AnthropicEvent {
  type: string;
  delta?: {
    type: string;
    text?: string;
  };
}

export const POST: APIRoute = async (context) => {
  const apiKey = context.locals.runtime.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let messages: ApiMessage[];
  let persona: Persona = "pm";
  try {
    const body = (await context.request.json()) as { messages: ApiMessage[]; persona?: Persona };
    messages = body.messages;
    if (body.persona === "eng-leader") persona = "eng-leader";
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const anthropicResponse = await fetch(
    "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        stream: true,
        system: persona === "eng-leader" ? ENG_LEADER_SYSTEM_PROMPT : SYSTEM_PROMPT,
        messages,
      }),
    }
  );

  if (!anthropicResponse.ok) {
    const text = await anthropicResponse.text();
    return new Response(
      JSON.stringify({ error: `Anthropic API error: ${text}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Transform Anthropic's SSE stream → plain text stream
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  const transformStream = new TransformStream({
    transform(chunk: Uint8Array, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const event = JSON.parse(data) as AnthropicEvent;
          if (
            event.type === "content_block_delta" &&
            event.delta?.type === "text_delta" &&
            event.delta.text
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        } catch {
          // skip malformed SSE lines
        }
      }
    },
    flush(controller) {
      if (buffer.startsWith("data: ")) {
        const data = buffer.slice(6).trim();
        try {
          const event = JSON.parse(data) as AnthropicEvent;
          if (
            event.type === "content_block_delta" &&
            event.delta?.type === "text_delta" &&
            event.delta.text
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        } catch {
          // ignore
        }
      }
    },
  });

  const textStream = anthropicResponse.body!.pipeThrough(transformStream);

  return new Response(textStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
};
