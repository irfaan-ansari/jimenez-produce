import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileType(url: string): "image" | "unknown" {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split(".").pop()?.toLowerCase();

    if (!ext) return "unknown";

    const imageExts = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "avif",
    ];

    if (imageExts.includes(ext)) return "image";

    return "unknown";
  } catch {
    return "unknown";
  }
}
