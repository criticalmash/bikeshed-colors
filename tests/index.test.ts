import { expect, test, describe } from 'vitest';

import { parseColor, getSpace, parseHEX, parseRGB, convertToInt, parseHSL, parseAlpha, RGBtoHSL } from '../src/parse';

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

describe('convertToInt', () => {
  test('should turn string into RGB compatible integer', () => {
    expect(convertToInt('100%', 0)).toBe(255);
    expect(convertToInt('0', 0)).toBe(0);
  });
  test('should convert any alpha values to integer [0-255]', () => {
    expect(parseAlpha('0.5', 255)).toBe(128);
    expect(parseAlpha('0', 255)).toBe(0);
    expect(parseAlpha('1', 255)).toBe(255);
  });
  test('should convert any alpha values to integer [0-100]', () => {
    expect(parseAlpha('0.5', 100)).toBe(50);
    expect(parseAlpha('50%', 100)).toBe(50);
    expect(parseAlpha('0', 100)).toBe(0);
    expect(parseAlpha('1', 100)).toBe(100);
  });
})

describe('parse color strings', () => {
  test('should parse Hex string and return RGBColorTriple', () => {
    expect(parseHEX('#ffffff')).toStrictEqual({r: 255, g:255, b:255, a: 255});
    expect(parseHEX('#ffffff00')).toStrictEqual({r: 255, g:255, b:255, a: 0});
    expect(parseHEX('#fff')).toStrictEqual({r: 255, g:255, b:255, a: 255});
  });

  test('should parse rgb() and rgba() strings and return RGBColorTriple', () => {
    expect(parseRGB('RGB(255 255 255)')).toStrictEqual({r: 255, g:255, b:255, a: 255});
    expect(parseRGB('rgb(50%, 30%, 10%)')).toStrictEqual({r: 128, g:77, b:26, a: 255}); // rgb(128, 77, 26) #804d1a
    expect(parseRGB('rgba(50%,30%,10%,0.5)')).toStrictEqual({r: 128, g:77, b:26, a: 128});
  })

  test('should parse hsl() and hsla strings and return a HSLColorTriple', () => {
    expect(parseHSL('hsl(0 0% 0%)')).toStrictEqual({h: 0, s:0, l:0, a: 100});
    expect(parseHSL('hsl(180 100% 50%)')).toStrictEqual({h: 180, s:100, l:50, a: 100});
    expect(parseHSL('hsl(180 10% 0%)')).toStrictEqual({h: 180, s:10, l:0, a: 100});
    expect(parseHSL('hsl(180deg,100%,50%)')).toStrictEqual({h: 180, s:100, l:50, a: 100});
    expect(parseHSL('hsla(210 100% 50% / 0.5)')).toStrictEqual({h: 210, s:100, l:50, a: 50});
  })
});

describe('convert color spaces', () => {
  test('should convert RGBColorDefinition to HSLColorDefinition', () => {
    let RGB = parseColor('#ffffff');
    let HSL = RGBtoHSL(RGB);
    expect(HSL.space).toBe('HSL');
    expect(HSL.l).toBe(100);
  })
})


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