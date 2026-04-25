export function getQueryObject(searchParams: URLSearchParams) {
  const params: Record<string, any> = {};

  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      params[key] = Array.isArray(params[key])
        ? [...params[key], value]
        : [params[key], value];
      continue;
    }
    if (!isNaN(Number(value)) && value.trim() !== "") {
      params[key] = Number(value);
    } else {
      params[key] = value;
    }
  }

  if ("page" in params && "limit" in params) {
    params.offset = (params.page - 1) * params.limit;
  }
  return params;
}
