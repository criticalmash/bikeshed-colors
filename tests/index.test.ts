import { expect, test, describe } from 'vitest';

import { parseColor, getSpace, parseHEX } from '../src/parse';

describe('get color space', () => {
  test('should recognize RGB color space from string', () => {
    expect(getSpace('#ffffff')).toBe('RGB');
    expect(getSpace('#FFFFFF')).toBe('RGB');
    expect(getSpace('#ffffff00')).toBe('RGB');
    expect(getSpace('#GGG')).toBe('UNKNOWN');
    expect(getSpace('rgb(0,0,0)')).toBe('RGB');
    expect(getSpace('RGBA(255 255 255 / 0.5)')).toBe('RGB');
  });

  test('should recognize HSL color space in css string', () => {
    expect(getSpace('hsl(180 100% 50%)')).toBe('HSL');
    expect(getSpace('hsla(3.14rad,100%,50%,0.5)')).toBe('HSL');
    expect(getSpace('hsla(180 100% 50% / 50%)')).toBe('HSL');
  })
  
});

describe('parse color strings', () => {
  test('should parse Hex string and return {r, g, b, a} object', () => {
    expect(parseHEX('#ffffff')).toStrictEqual({r: 255, g:255, b:255, a: 255});
    expect(parseHEX('#ffffff00')).toStrictEqual({r: 255, g:255, b:255, a: 0});
    expect(parseHEX('#fff')).toStrictEqual({r: 255, g:255, b:255, a: 255});
  })
});


test('Convert Hex to object with RGB props', () => {
  let co = parseColor('#ffffff');
  expect(co.r).toBe(255);
})


test('Convert Hex to object and back to hex', () => {
  let co = parseColor('#aabbcc');
  expect(co.toHexString()).toBe('#aabbcc');
})

test('Convert Hex to HexAlpha', () => {
  let co = parseColor('#aabbcc');
  expect(co.toHexAString()).toBe('#aabbccff');
})