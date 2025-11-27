export async function onRequest(context) {
  const { request, env } = context;

  // Hantera CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Använd POST.", { status: 405 });
  }

  try {
    if (!env.AI_AGENT) throw new Error("Binding AI_AGENT saknas.");

    // Hämta hela JSON-kroppen från frontenden (som nu innehåller historiken)
    const body = await request.json();
    
    // Skicka vidare hela paketet till Agenten
    const agentResponse = await env.AI_AGENT.fetch("http://internal", {
      method: "POST",
      body: JSON.stringify(body)
    });

    const answer = await agentResponse.text();

    return new Response(JSON.stringify({ response: answer }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
