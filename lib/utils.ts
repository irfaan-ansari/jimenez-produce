import { upload } from "@vercel/blob/client";
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

export function capitalizeWords(str: string) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const uploadFile = async (file: File | undefined) => {
  if (!file) return { url: "" };

  return await upload(`job-application/${file.name}`, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
};

export const formatUSD = (value: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(value as string));

import { addDays } from "date-fns";

export const getNextDayDate = (dayName: string) => {
  const daysMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const today = new Date();
  const todayIndex = today.getDay();

  const targetIndex = daysMap[dayName.toLowerCase()];

  if (targetIndex === undefined) {
    throw new Error("Invalid day name");
  }

  let diff = targetIndex - todayIndex;

  // if same day or past → go to next week
  if (diff <= 0) {
    diff += 7;
  }

  return addDays(today, diff);
};
