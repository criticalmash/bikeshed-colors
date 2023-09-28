# bikeshed-colors
Color parsing, converting and formatting library. Should parse any CSS color string and return a color object. Color objects can be converted back into a string with the given format.

Should parse and output...
RGB(a) values: #001122; #001122AA; rgb(100, 200, 300), rgb(50%, 30%, 10%); RGB(255 255 255)
 
HSL(a) Values: hsl(240,100%,50%); hsl(180deg,100%,50%); hsl(0.5turn 100% 50%)

The functions in this library come in three categories:
Parsers: take a string ('#001122', 'rgb(100, 200, 300)', hsl(180deg,100%,50%)) and convert them into color definition objects (RGB or HSL)
Transformers: convert RGB objects into HSL or vice versa
Formatters: turns color objects into a chosen string format (Hex, rgb, hsl)
