interface ValidateDocumentResponse {
  valid: boolean;
  message: string;
}

export async function validateDocument({
  fileUrl,
  type,
}: {
  fileUrl: string;
  type: string;
}): Promise<{ data: ValidateDocumentResponse }> {
  const res = await fetch("/api/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileUrl,
      type,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to validate document.");
  }

  return data;
}
