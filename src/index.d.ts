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
 * @param {number} r Red value [0-255]
 * @param {number} g Green value [0-255]
 * @param {number} b Blue value [0-255]
 */
export interface RGBColorDefinition extends ColorDefinition {
  readonly space: 'RGB';
  r: number;
  g: number;
  b: number;
}

export type HSLColorDefinition = {
  readonly space: 'HSL';
  h: number;
  s: number;
  l: number;
}