import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { DimensionId } from "@/src/types";
import formattedValue from "@/src/components/utils/FormatValues";

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
    // const prompt = `In one short sentence, explain what ${numericValue} ${selectedUnit} feels like using a realistic everyday Nigerian comparison that strictly matches the unit type (distance with travel or places, weight with loads or carrying, volume with containers or liquids, temperature with weather), do NOT mention Lagos or any city unless necessary, and briefly relate it to ${convertedValue} ${targetResult}.`;

    function buildPrompt({
      numericValue,
      selectedUnit,
      targetUnit,
      convertedValue,
      dimension,
    }: {
      numericValue: number;
      selectedUnit: string;
      targetUnit: string;
      convertedValue: number;
      dimension: DimensionId;
    }) {
      switch (dimension) {
        case "length":
          return `
In one clear sentence, describe what ${formattedValue(numericValue)} ${selectedUnit} represents by comparing it to a real, well-known journey or distance using named locations in Nigeria or globally recognised routes (e.g. Abuja–Kaduna road, Third Mainland Bridge, London–Paris), including an approximate travel time where reasonable, and briefly relate it to its equivalent of ${convertedValue} ${targetUnit}. 
Avoid vague or invented places.
`;

        case "weight":
          return `
In one clear sentence, explain what ${formattedValue(numericValue)} ${selectedUnit} feels like by comparing it to the weight of familiar real-life items commonly encountered in Nigeria (such as bags of rice, cement, bottled water, or gas cylinders), and briefly relate it to its equivalent of ${convertedValue} ${targetUnit}.
`;

        case "volume":
          return `
In one clear sentence, describe what ${formattedValue(numericValue)} ${selectedUnit} represents by comparing it to real, commonly used containers or liquid quantities (such as water bottles, jerry cans, buckets, or fuel tanks), strictly avoiding distance or time references, and briefly relate it to its equivalent of ${convertedValue} ${targetUnit}.
`;

        case "temperature":
          return `
In one clear sentence, explain what ${formattedValue(numericValue)} ${selectedUnit} feels like by comparing it to familiar weather conditions or physical sensations (such as a hot afternoon sun, cool harmattan morning, or refrigerated cold), and briefly relate it to its equivalent of ${convertedValue} ${targetUnit}.
`;

        default:
          throw new Error("Unsupported dimension");
      }
    }

    const prompt = buildPrompt({
      numericValue,
      selectedUnit,
      targetUnit: targetResult,
      convertedValue,
      dimension: selectedDimension,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are a practical Nigerian educator who makes measurements relatable through authentic local context.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 100,
      top_p: 0.95,
      presence_penalty: 0.6,
      frequency_penalty: 0.7,
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
