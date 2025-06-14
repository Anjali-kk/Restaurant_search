import { corsHeaders } from '../_shared/cors.ts';

interface ChatRequest {
  message: string;
  context?: string;
  restaurants?: any[];
}

interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatGPTResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, restaurants }: ChatRequest = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build system message with restaurant context
    let systemMessage = `You are a helpful restaurant assistant. You help users find restaurants, answer questions about cuisines, pricing, locations, and provide dining recommendations.

Key guidelines:
- Be friendly and conversational
- Provide specific recommendations when possible
- If asked about restaurants not in the provided data, suggest similar alternatives
- Help with dietary restrictions and preferences
- Provide practical information like hours, pricing, and location details
- Keep responses concise but informative`;

    if (restaurants && restaurants.length > 0) {
      systemMessage += `\n\nHere are the current restaurants available:\n${restaurants.map(r => 
        `- ${r.name}: ${r.cuisine} cuisine, ${r.rating}★, ${r.priceRange}, located at ${r.address}`
      ).join('\n')}`;
    }

    if (context) {
      systemMessage += `\n\nAdditional context: ${context}`;
    }

    const messages: ChatGPTMessage[] = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: message }
    ];

    // Make request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData}`);
    }

    const openaiData: ChatGPTResponse = await openaiResponse.json();
    const assistantMessage = openaiData.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from ChatGPT');
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('ChatGPT error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get ChatGPT response',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});