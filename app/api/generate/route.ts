import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const {
      numericValue,
      selectedUnit,
      targetResult,
      selectedDimension,
      convertedValue,
    } = await req.json();

    //     const prompt = `
    // Explain what ${convertedValue} ${targetResult} feels like in everyday Nigerian life.
    // Use familiar examples.
    // Keep it simple, friendly, and no more than 1 sentence.
    // `;
    const prompt = `In one short sentence, explain what ${numericValue} ${selectedUnit} feels like using a realistic everyday Nigerian comparison that strictly matches the unit type (distance with travel or places, weight with loads or carrying, volume with containers or liquids, temperature with weather), do NOT mention Lagos or any city unless necessary, and briefly relate it to ${convertedValue} ${targetResult}.`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 100,
      reasoning_effort: "low",
    });

    const text = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("GROQ API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 },
    );
  }
}
