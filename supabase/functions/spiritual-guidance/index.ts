import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problem, book } = await req.json();

    if (!problem) {
      return new Response(
        JSON.stringify({ error: "Problem is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    if (book === "Bible") {
      systemPrompt = "You are a compassionate spiritual guide. When given a problem, find relevant verses from the Bible and provide loving, wise guidance. Format your response with 'Verse:' followed by the verse reference and text, then 'Explanation:' with practical spiritual guidance.";
    } else if (book === "Quran") {
      systemPrompt = "You are a compassionate spiritual guide. When given a problem, find relevant verses from the Quran (include Surah and Ayah numbers) and provide loving, wise guidance. Format your response with 'Verse:' followed by the verse reference and text, then 'Explanation:' with practical spiritual guidance.";
    } else if (book === "Bhagavad Gita") {
      systemPrompt = "You are a compassionate spiritual guide. When given a problem, find relevant verses from the Bhagavad Gita (include Chapter and Verse numbers) and provide loving, wise guidance. Format your response with 'Verse:' followed by the verse reference and text, then 'Explanation:' with practical spiritual guidance.";
    } else if (book === "Compare All") {
      systemPrompt = "You are a compassionate spiritual guide. When given a problem, find relevant verses from the Bible, Quran, AND Bhagavad Gita. Show how each tradition addresses this concern. Format your response with clear sections for each text, using 'Verse:' followed by the verse, then brief 'Explanation:' for each.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: problem }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the response to separate verse and explanation
    const verseMatch = content.match(/Verse:(.*?)(?=Explanation:|$)/s);
    const explanationMatch = content.match(/Explanation:(.*)/s);

    return new Response(
      JSON.stringify({
        verse: verseMatch ? verseMatch[1].trim() : content,
        explanation: explanationMatch ? explanationMatch[1].trim() : "",
        fullText: content
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in spiritual-guidance function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
