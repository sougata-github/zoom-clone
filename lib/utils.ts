import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractPath = (url: string) => {
  const baseUrls = ["localhost:3000", "yoom-next.vercel.app"];
  for (const baseUrl of baseUrls) {
    if (url?.startsWith(baseUrl)) {
      return url?.substring(baseUrl.length).replace(/^\//, ""); // Remove leading '/'
    }
  }
  return url;
};
