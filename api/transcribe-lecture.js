import { experimental_transcribe as transcribe } from "ai";
import { gateway } from "@ai-sdk/gateway";

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { audioUrl, language } = req.body || {};
    if (!audioUrl || typeof audioUrl !== "string") {
      return res.status(400).json({ error: "A video/audio URL is required." });
    }
    if (!audioUrl.startsWith("https://")) {
      return res.status(400).json({ error: "Only HTTPS media URLs are supported." });
    }

    const result = await transcribe({
      model: gateway.transcriptionModel("openai/gpt-4o-mini-transcribe"),
      audio: new URL(audioUrl),
      ...(language ? { language } : {}),
    });

    const text = String(result.text || "").trim();
    if (text.length < 50) {
      return res.status(422).json({ error: "The audio did not contain enough recognizable speech to create a transcript." });
    }
    return res.status(200).json({
      transcript: text,
      language: result.language || language || null,
      duration: result.durationInSeconds || null
    });
  } catch (e) {
    console.error("Lecture transcription failed:", e);
    return res.status(500).json({ error: e?.message || "Unable to transcribe the lecture audio." });
  }
}