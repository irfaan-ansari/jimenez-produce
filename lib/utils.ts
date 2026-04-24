import { twMerge } from "tailwind-merge";
import { upload } from "@vercel/blob/client";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarFallback(value?: string | null): string {
  if (!value) return "??";

  const trimmed = value.trim();
  if (!trimmed) return "??";

  // If email, take part before @
  const namePart = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;

  const parts = namePart.split(" ").filter(Boolean);

  // Take first letter of first + second word (if exists)
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";

  const initials = (first + second).toUpperCase();

  return initials || "??";
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

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  const match = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

  if (!match) return value;

  const [, a, b, c] = match;

  if (b) return `${a}-${b}${c ? `-${c}` : ""}`;
  if (a) return a;
  return "";
};

export const getInitialsAvatar = (name: string) => {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(name)}`;
};
