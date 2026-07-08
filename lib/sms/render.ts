export function renderTemplate(
  template: string,
  variables: Record<string, string | number>,
) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const value = variables[key];
    return value == null ? "" : String(value);
  });
}
