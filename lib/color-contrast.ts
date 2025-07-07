/**
 * Color contrast utilities for ensuring readable text on any background
 * Based on WCAG guidelines for accessibility
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB color string to RGB object
 */
function rgbStringToRgb(rgb: string): { r: number; g: number; b: number } | null {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  }
  return null;
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG formula: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const r2 = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g2 = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b2 = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if text should be dark or light based on background color
 * @param backgroundColor - Hex color (e.g., "#ffffff") or RGB string (e.g., "rgb(255, 255, 255)")
 * @returns "dark" or "light" for optimal contrast
 */
export function getContrastTextColor(backgroundColor: string): "dark" | "light" {
  let rgb = hexToRgb(backgroundColor);
  
  if (!rgb) {
    rgb = rgbStringToRgb(backgroundColor);
  }
  
  if (!rgb) {
    console.warn(`Invalid color format: ${backgroundColor}. Defaulting to dark text.`);
    return "dark";
  }

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  
  // Threshold based on WCAG guidelines
  // 0.179 is approximately the luminance of #777777
  return luminance > 0.179 ? "dark" : "light";
}

/**
 * Get actual color values for text based on background
 * @param backgroundColor - Hex or RGB color
 * @returns Object with color values for different text elements
 */
export function getContrastColors(backgroundColor: string) {
  const textColor = getContrastTextColor(backgroundColor);
  
  if (textColor === "dark") {
    return {
      primary: "#1a1a1a",      // Very dark gray for main text
      secondary: "#4a4a4a",    // Medium gray for secondary text
      muted: "#6a6a6a",        // Lighter gray for muted text
      accent: "#0066cc",       // Blue for links/accents
      className: "text-gray-900", // Tailwind class for primary text
      secondaryClassName: "text-gray-700", // Tailwind class for secondary
      mutedClassName: "text-gray-600", // Tailwind class for muted
    };
  } else {
    return {
      primary: "#ffffff",      // White for main text
      secondary: "#e5e5e5",    // Light gray for secondary text
      muted: "#cccccc",        // Medium gray for muted text
      accent: "#66b3ff",       // Light blue for links/accents
      className: "text-white", // Tailwind class for primary text
      secondaryClassName: "text-gray-200", // Tailwind class for secondary
      mutedClassName: "text-gray-300", // Tailwind class for muted
    };
  }
}

/**
 * React hook to use contrast colors based on background
 */
export function useContrastText(backgroundColor: string) {
  return getContrastColors(backgroundColor);
}

/**
 * Check if a color combination meets WCAG AA standards
 * @param textColor - Hex or RGB color
 * @param backgroundColor - Hex or RGB color
 * @returns true if contrast ratio is at least 4.5:1 (AA standard for normal text)
 */
export function meetsWCAGAA(textColor: string, backgroundColor: string): boolean {
  const text = hexToRgb(textColor) || rgbStringToRgb(textColor);
  const bg = hexToRgb(backgroundColor) || rgbStringToRgb(backgroundColor);
  
  if (!text || !bg) return false;
  
  const ratio = getContrastRatio(text, bg);
  return ratio >= 4.5; // WCAG AA standard for normal text
}

/**
 * Get a color that ensures WCAG AA compliance against the background
 * @param backgroundColor - Hex or RGB color
 * @param preferredColor - Preferred text color (will be adjusted if needed)
 * @returns Adjusted color that meets WCAG AA standards
 */
export function ensureWCAGCompliance(backgroundColor: string, preferredColor: string): string {
  if (meetsWCAGAA(preferredColor, backgroundColor)) {
    return preferredColor;
  }
  
  // If preferred color doesn't meet standards, return high-contrast alternative
  const textColor = getContrastTextColor(backgroundColor);
  return textColor === "dark" ? "#000000" : "#ffffff";
}