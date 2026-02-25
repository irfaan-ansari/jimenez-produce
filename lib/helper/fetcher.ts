export async function fetcher<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, {});

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error?.message ?? "Network error. Please check your connection."
    );
  }
}
