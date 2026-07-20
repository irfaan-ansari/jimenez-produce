import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { BASE_PROMPT, DOCUMENTS } from "@/lib/validate-docoment/documents";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const ALLOWED_ORIGINS = ["https://jimenezproduce.com/"];

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");

    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      throw new Error("Forbidden");
    }

    const { fileUrl, type } = await req.json();

    if (!fileUrl || !type) throw new Error("File type and url is required.");
    const config = DOCUMENTS[type as keyof typeof DOCUMENTS];

    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error("Unable to download file.");
    }
    const contentType = response.headers.get("content-type") ?? "";

    const content = contentType.startsWith("image/")
      ? [
          {
            type: "input_image" as const,
            image_url: fileUrl,
            detail: "auto" as const,
          },
        ]
      : contentType === "application/pdf"
        ? [
            {
              type: "input_file" as const,
              file_url: fileUrl,
            },
          ]
        : null;

    if (!content) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }

    if (!content) throw new Error("Unsupported file");

    const result = await openai.responses.parse({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: `${BASE_PROMPT} ${config.prompt}`,
        },
        {
          role: "user",
          content,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "document_validation",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              valid: {
                type: "boolean",
              },
              message: {
                type: "string",
              },
            },
            required: ["valid", "message"],
          },
        },
      },
    });
    console.log(result);
    const validation = JSON.parse(result.output_text);
    return NextResponse.json({ data: validation }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      {
        valid: false,
        message: e?.message ?? "Failed to validate document.",
      },
      { status: 500 },
    );
  }
}
