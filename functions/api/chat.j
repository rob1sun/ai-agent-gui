export async function onRequestPost({ request, env }) {
  try {
    const { message } = await request.json();

    // Anropa din ai-agent via Service Binding (snabbare än HTTP)
    // Vi antar att din agent tar emot ?q=... via GET
    const agentResponse = await env.AI_AGENT.fetch(
      `http://internal/?q=${encodeURIComponent(message)}`
    );

    const answer = await agentResponse.text();

    return new Response(JSON.stringify({ response: answer }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Något gick fel." }), { status: 500 });
  }
}
