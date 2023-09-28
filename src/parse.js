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


/**
 * Parses a CSS color string into an object 
 * @param {string} input CSS color value
 * @return {Colors.RGBColorDefinition} RGBColorDefinition
 */
export function parseColor(input){
  if (typeof input != 'string') {
    throw Error(`input must be type string, received ${typeof input}`);
  }
  const space = getSpace(input);

  let color;
  switch (space) {
    case 'RGB':
      color = parseHEX(input);
      break;
  
    default:
      break;
  }

  /**
   * Converts ColorDef to CSS hex string
   * @returns {string} Hex color string
   */
  function toHexString(){
    const rHex = color.r.toString(16).padStart(2, '0');
    const gHex = color.g.toString(16).padStart(2, '0');
    const bHex = color.b.toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}`; 
  }

  function toHexAString(){
    const hex = toHexString();
    const alpha = color.a.toString(16).padStart(2, '0');
    return hex + alpha;
  }

  return {
    get space(){return space;},
    toHexString,
    toHexAString,
    ...color,
  }
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