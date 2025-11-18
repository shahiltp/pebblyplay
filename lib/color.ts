/**
 * Color contrast utilities for WCAG-compliant text on colored backgrounds.
 * Uses relative luminance calculation to determine optimal text color.
 */

/**
 * Calculate relative luminance of a color (0-1 scale).
 * Handles hex colors (with or without #) and RGB values.
 * 
 * Formula based on WCAG 2.1: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getRelativeLuminance(color: string): number {
  // Normalize color input
  let hex = color.trim();
  
  // Remove # if present
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }
  
  // Handle 3-digit hex (e.g., #FFF -> #FFFFFF)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // Parse RGB values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determine whether black or white text should be used on a given background color.
 * Uses relative luminance threshold (0.5) to decide.
 * 
 * @param bg - Background color in hex format (with or without #)
 * @returns 'black' for light backgrounds, 'white' for dark backgrounds
 */
export function getTextOn(bg: string): 'black' | 'white' {
  const luminance = getRelativeLuminance(bg);
  // Threshold of 0.5 works well for most cases
  // Higher luminance = lighter color = use black text
  return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Get background and appropriate text color pair.
 * 
 * @param bg - Background color in hex format (with or without #)
 * @returns Object with bg (normalized hex) and text (hex) colors
 */
export function withTextOn(bg: string): { bg: string; text: string } {
  // Normalize bg to always have #
  const normalizedBg = bg.startsWith('#') ? bg : `#${bg}`;
  
  const textColor = getTextOn(normalizedBg);
  const textHex = textColor === 'black' ? '#000000' : '#FFFFFF';
  
  return {
    bg: normalizedBg,
    text: textHex,
  };
}

