


// export default function parseToHsl(color: string): HslColor | HslaColor {
//     // Note: At a later stage we can optimize this function as right now a hsl
//     // color would be parsed converted to rgb values and converted back to hsl.
//     return rgbToHsl(parseToRgb(color))
//   }


// function darken(amount: number | string, color: string): string {
//     if (color === 'transparent') return color
//     const hslColor = parseToHsl(color)
//     return toColorString({
//       ...hslColor,
//       lightness: guard(0, 1, hslColor.lightness - parseFloat(amount)),
//     })
//   }