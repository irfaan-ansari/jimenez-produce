export const BASE_PROMPT = `
You are validating uploaded business documents.

Determine whether:
- The document matches the expected document type.
- The document is readable.
- The document is complete and not cropped.
- The document is authentic and appears valid.
- The document is not expired read carefully
- 

Reject if:
- It is the wrong document.
- It is blurry or unreadable.
- It is cropped or incomplete.
- Important information is missing.
- it is expired very important
Return ONLY valid JSON:

{
  "valid": boolean,
  "message": string
}

Requirements:
- Return a single "message" with a maximum of 10 words.
- If invalid, mention only the primary validation failure.
- Use a concise, form field error tone (e.g., "Document is expired", "Image is blurry","Invalid document").
- Do not include explanations, suggestions, or multiple errors.
- If valid, return a short confirmation message.
`;
export const DOCUMENTS = {
  certificate: {
    name: "Sales Tax Resale Certificate",
    prompt: `
Expected document:
A valid US Sales Tax Resale Certificate.
Determine whether:
- document is valid
- do not give wrong answer
- it should not be expired
`,
  },

  dlFront: {
    name: "Driver's License Front",
    prompt: `
Expected document:
A valid US Driver's License front side.
`,
  },
  dlBack: {
    name: "Driver's License Back",
    prompt: `
Expected document:
A valid US Driver's License back side.
`,
  },

  ein: {
    name: "IRS EIN Letter",
    prompt: `
Expected document:
An IRS CP 575 or 147C EIN confirmation letter.
`,
  },
} as const;
