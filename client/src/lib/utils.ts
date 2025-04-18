import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEmoji(input: string): boolean {
  // Basic emoji pattern: covers most common emojis including flags and modifiers
  const emojiRegex =
    /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})(?:\p{Emoji_Modifier})?$/u

  return emojiRegex.test(input.trim())
}
