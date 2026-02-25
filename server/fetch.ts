export type FetchResult<T> = {
  success: boolean;
  status: number;
  data: T | null;
  error: string | null;
};

export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<FetchResult<T>> {
  try {
    const res = await fetch(input, init);

    const body = await res.json();

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        data: null,
        error:
          body?.message ??
          body?.error ??
          "Something went wrong. Please try again.",
      };
    }

    return {
      success: true,
      status: res.status,
      data: body as T,
      error: null,
    };
  } catch {
    return {
      success: false,
      status: 0,
      data: null,
      error: "Network error. Please check your connection.",
    };
  }
}
