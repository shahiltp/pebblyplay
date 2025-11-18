/**
 * Unit tests for color contrast utilities
 * Run with: node --loader tsx lib/__tests__/color.test.ts
 * Or use a test runner like Vitest/Jest
 */

import { getTextOn, withTextOn } from '../color';

// Simple test runner
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(error);
    process.exit(1);
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
      }
    },
  };
}

// Test cases
test('getTextOn: black text on yellow background', () => {
  // Yellow (#FFFF00) is a light color, should use black text
  expect(getTextOn('#FFFF00')).toBe('black');
  expect(getTextOn('FFFF00')).toBe('black');
});

test('getTextOn: white text on indigo background', () => {
  // Indigo (#4F46E5) is a dark color, should use white text
  expect(getTextOn('#4F46E5')).toBe('white');
  expect(getTextOn('4F46E5')).toBe('white');
});

test('getTextOn: text on primary brand color', () => {
  // Primary brand color (#FF7A59) - test that it returns a valid result
  const result = getTextOn('#FF7A59');
  // Should return either 'black' or 'white' based on luminance calculation
  expect(result === 'black' || result === 'white').toBe(true);
  // For this specific orange color, it should use white text (luminance < 0.5)
  expect(result).toBe('white');
});

test('getTextOn: white text on dark blue', () => {
  // Dark blue (#1E3A8A) should use white text
  expect(getTextOn('#1E3A8A')).toBe('white');
});

test('getTextOn: black text on white', () => {
  // White should use black text
  expect(getTextOn('#FFFFFF')).toBe('black');
  expect(getTextOn('FFFFFF')).toBe('black');
});

test('getTextOn: white text on black', () => {
  // Black should use white text
  expect(getTextOn('#000000')).toBe('white');
  expect(getTextOn('000000')).toBe('white');
});

test('withTextOn: returns bg and text pair for yellow', () => {
  const result = withTextOn('#FFFF00');
  expect(result.bg).toBe('#FFFF00');
  expect(result.text).toBe('#000000');
});

test('withTextOn: returns bg and text pair for indigo', () => {
  const result = withTextOn('#4F46E5');
  expect(result.bg).toBe('#4F46E5');
  expect(result.text).toBe('#FFFFFF');
});

test('withTextOn: normalizes hex without #', () => {
  const result = withTextOn('4F46E5');
  expect(result.bg).toBe('#4F46E5');
  expect(result.text).toBe('#FFFFFF');
});

test('withTextOn: handles 3-digit hex', () => {
  // #FFF should be treated as #FFFFFF
  const result = withTextOn('#FFF');
  expect(result.bg).toBe('#FFF');
  expect(result.text).toBe('#000000');
});

console.log('\nAll tests passed! ✓');

