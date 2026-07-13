export function renderTemplate(
  template: string,
  variables: Record<string, string | number>,
) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const value = variables[key];
    return value == null ? "" : String(value);
  });
}

export function extractVariables(
  template: string,
  entity: Record<string, unknown>,
): Record<string, string | number> {
  const matches = template.match(/\{\{\s*(\w+)\s*\}\}/g) ?? [];

  return Object.fromEntries(
    matches.map((match) => {
      const key = match.match(/\w+/)?.[0]!;
      return [key, entity[key] as string | number];
    }),
  );
}
