import * as Colors from './index.d.ts';


/*
 * Regular Expressions
 * hat tip to https://css-tricks.com/converting-color-spaces-in-javascript/#aa-validating-colors
 */
const isHex = /^#([\da-f]{3}){1,2}$/i;
const isHexAlpha = /^#([\da-f]{4}){1,2}$/i;
const isRGB = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
const isRGBA = /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
const isHSL = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
const isHSLA = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;

const getVarsRE = /[0-9.]+%*/g;

/**
 * Parses a CSS color string into an object 
 * @param {string} input CSS color value
 * @return {Colors.RGBColorDefinition} RGBColorDefinition
 */
export function parseColor(input){
  if (typeof input != 'string') {
    throw Error(`input must be type string, received ${typeof input}`);
  }
  // const space = getSpace(input);
  const format = getFormat(input);

  let color;
  switch (format.format) {
    case 'HEX':
      color = parseHEX(input);
      break;
    case 'RGB':
        color = parseRGB(input);
        break;
    case 'HSL':
      color = parseHSL(input);
    default:
      break;
  }
 
  return {
    get space(){return format.space;},
    toHexString: () => toHexString(color),
    toHexAString: () => toHexAString(color),
    ...color,
  }
}

 /**
   * Converts ColorDef to CSS hex string
   * @returns {string} Hex color string
   */
 function toHexString(color){
  const rHex = color.r.toString(16).padStart(2, '0');
  const gHex = color.g.toString(16).padStart(2, '0');
  const bHex = color.b.toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`; 
}

function toHexAString(color){
  const hex = toHexString(color);
  const alpha = color.a.toString(16).padStart(2, '0');
  return hex + alpha;
}


export function getSpace(input){
  if(isHex.test(input) | isHexAlpha.test(input) | isRGB.test(input) | isRGBA.test(input)){
    return 'RGB';
  }
  if(isHSL.test(input) | isHSLA.test(input)){
    return 'HSL';
  }
  return 'UNKNOWN';
}

export function getFormat(input){
  if(isHex.test(input) | isHexAlpha.test(input)){
    return {space: 'RGB', format: 'HEX'};
  }
  if(isRGB.test(input) | isRGBA.test(input)){
    return  {space: 'RGB', format: 'RGB'};
  }
  if(isHSL.test(input) | isHSLA.test(input)){
    return  {space: 'HSL', format: 'HSL'};
  }
  return 'UNKNOWN';
}


/**
 * 
 * @param {string} input valid hex/hexAlpha string
 * @returns {Colors.RGBColorTriple}
 */
export function parseHEX(input){
  let r = 0, g = 0, b = 0, a = 255;
  if (!isHex.test(input) && !isHexAlpha.test(input)) {
    throw new Error(`Malformed hex value ${input}`);
  }
  if (input.length == 4) {
    [r, g, b] = input.match(/[0-9a-f]/gi)?.map((v) => parseInt(v + v, 16) );
  } else if(input.length == 7){
    [r, g, b] = input.match(/[0-9a-f]{2}/gi)?.map((v) => parseInt(v, 16) );
  }else{
    [r, g, b, a] = input.match(/[0-9a-f]{2}/gi)?.map((v) => parseInt(v, 16) );
  }
  // if(a === undefined){
  //   a = 255;
  // }

  return { r, g, b, a }
}

/**
 * 
 * @param {string} input a CSS RGB(a) string
 * @returns {Colors.RGBColorTriple}
 */
export function parseRGB(input){
  let r = 0, g = 0, b = 0, a = 255;
  if (!isRGB.test(input) && !isRGBA.test(input)) {
    throw new Error(`Malformed RGB(A) value ${input}`);
  }
  [r, g, b, a] = input.match(getVarsRE)?.map(convertToInt);
  if(a === undefined){
    a = 255;
  }

  return { r, g, b, a }
}

export function parseHSL(input){
  let h = 0, s = '0', l = 0, a = 100;
  if (!isHSL.test(input) && !isHSLA.test(input)) {
    throw new Error(`Malformed HSL(A) value ${input}`);
  }
  [h, s, l, a] = input.match(getVarsRE);

  h = Number(h);
  s = parseInt(s.replace('%', ''));
  l = parseInt(l.replace('%', ''));

  // console.log('hsla', h,s,l,a);

  if(a === undefined){
    a = 100;
  }else{
    a = parseAlpha(a, 100);
  }
  return {h, s, l, a}
}

export function parseAlpha(input, base=100){
  let alpha = 1;

  [alpha] = input.match(getVarsRE);

  if (alpha.indexOf("%") > -1){
    alpha = alpha.substring(0, alpha.length - 1);
    alpha = Number(alpha);
  }else{
    alpha = Math.round(alpha * base);
  }
  return alpha;
}

/**
 * Converts a string ('255', '50%', etc) into a number in RGB range [0,255]
 * @param {string|number} input 
 * @returns {number} number between 0 to 255
 */
export function convertToInt(input, index){
  if (typeof input == 'number') {
    return input;
  }
  if (typeof input != 'string') {
    throw new Error(`Input must be string or number ${input}`);
  }

  if (input.indexOf("%") > -1){
    input = input.substring(0, input.length - 1);
    input = Number(input);
    input = Math.round( input / 100 * 255);
  }
  else if (index == 3) {
    // console.log('is decimal alpha', input);
    // input = Math.round(input * 255);
    input = parseAlpha(input, 255);
  }
  input = Number(input);

  return input;
}


export function RGBtoHSL(rgb){
  const space = 'HSL';
  let h,s,l;
  let r = rgb.r/255;
  let g = rgb.g/255;
  let b = rgb.b/255;

  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin;
  // Calculate hue
  // No difference
  if (delta == 0)
    h = 0;
  // Red is max
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g)
    h = (b - r) / delta + 2;
  // Blue is max
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60); // convert to degrees?
    
  // Make negative hues positive behind 360°
  if (h < 0)
      h += 360;
  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {
    get space(){return space;},
    h,
    s,
    l
  };
}