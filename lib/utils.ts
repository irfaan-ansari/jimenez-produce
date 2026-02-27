import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarFallback(value?: string | null): string {
  if (!value) return "??";

  const trimmed = value.trim();

  if (!trimmed) return "??";

  // If it's an email, use the part before @
  const namePart = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;

  const parts = namePart.split(" ").filter(Boolean);

  // If full name → take first letter of first + last word
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // If single word → take first 2 letters
  return parts[0].slice(0, 2).toUpperCase();
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
