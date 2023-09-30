/**
 * @param {number} a Alpha channel value
 */
export interface ColorDefinition {
  space:  'RGB'|'HSL';
  a: number;
  toHexString(): string;
  toHexAString(): string;
}

/**
 * Defines an RGB color
 * @param {number}  r Red value [0-255]
 * @param {number}  g Green value [0-255]
 * @param {number}  b Blue value [0-255]
 * @param {number}  a Alpha value [0-100] default 100
 */
export interface RGBColorDefinition extends ColorDefinition {
  readonly space: 'RGB';
  r: number;
  g: number;
  b: number;
  a: number
}

/**
 * Defines a color using HSL space
 * @param {string} space 
 * @param {number}  h colors hue in degrees [0,360]
 * @param {number}  s saturation [0,100] default ?100?
 * @param {number}  l lightness [0,100] default 50 
 * @param {number}  a Alpha value [0-100] default 100
 */
export type HSLColorDefinition = {
  readonly space: 'HSL';
  h: number;
  s: number;
  l: number;
  a: number;
}

export type RGBColorTriple = {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type HSLColorTriple = {
  readonly space: 'HSL';
  h: number;
  s: number;
  l: number;
  a: number;
}