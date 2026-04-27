interface ReturnType {
  page: number;
  limit: number;
  offset: number;
  q?: string;
  [key: string]: any;
}

export function getQueryObject(searchParams: URLSearchParams): ReturnType {
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

  if ("page" in params) {
    params.offset = (params.page - 1) * (params.limit ?? 24);
  }
  return {
    ...params,
    page: Number(params.page ?? 1),
    limit: Number(params.limit ?? 24),
    offset: Number(params.offset ?? 0),
  };
}
