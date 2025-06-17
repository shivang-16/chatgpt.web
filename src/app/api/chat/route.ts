import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Parse form-data
    const formData = await req.formData();
    console.log(formData, "here is conten")
    const text = formData.get("message") as string;
    const fileBlobs = formData.getAll("files") as File[];

    // 2. Build Gemini‐compatible message list
    const messages: Array<any> = [];

    // First, the text part
    if (text) {
      messages.push({
        role: "user",
        content: {
          type: "text",
          text,
        },
      });
    }

    // Then, each file part
    for (const file of fileBlobs) {
      const arrayBuffer = await file.arrayBuffer();
      messages.push({
        role: "user",
        content: {
          type: "file",
          data: new Uint8Array(arrayBuffer),
          mimeType: file.type,
          // optionally: filename: file.name,
        },
      });
    }

    // 3. Call Gemini in streaming mode
    const result = await streamText({
      model: google("gemini-2.0-flash"),
      messages,
      temperature: 0.7,
    });

    // 4. Return the streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
