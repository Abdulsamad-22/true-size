import { Dimension, DimensionId, Unit } from "../types";

export const units: Unit[] = [
  { id: "mm", name: "Millimeters", symbol: "mm" },
  { id: "cm", name: "Centimeters", symbol: "cm" },
  { id: "m", name: "Meters", symbol: "m" },
  { id: "in", name: "Inches", symbol: "in" },
  { id: "ft", name: "Feet", symbol: "ft" },
];
const conversionToMm: Record<string, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};

export const DIMENSIONS: Record<DimensionId, Dimension> = {
  length: {
    id: "length",
    name: "Length",
    units: [
      { id: "mm", name: "Millimeters", symbol: "mm" },
      { id: "cm", name: "Centimeters", symbol: "cm" },
      { id: "m", name: "Meters", symbol: "m" },
      { id: "in", name: "Inches", symbol: "in" },
      { id: "ft", name: "Feet", symbol: "ft" },
      { id: "yd", name: "Yards", symbol: "yd" },
      { id: "mi", name: "Miles", symbol: "mi" },
      { id: "km", name: "Kilometers", symbol: "km" },
    ],
    conversions: {
      mm: 1,
      cm: 10,
      m: 1000,
      in: 25.4,
      ft: 304.8,
      yd: 914.4,
      mi: 1609344,
      km: 1000000,
    },
  },

  weight: {
    id: "weight",
    name: "Weight",
    units: [
      { id: "mg", name: "Milligrams", symbol: "mg" },
      { id: "g", name: "Grams", symbol: "g" },
      { id: "kg", name: "Kilograms", symbol: "kg" },
      { id: "oz", name: "Ounces", symbol: "oz" },
      { id: "lb", name: "Pounds", symbol: "lb" },
      { id: "ton", name: "Tons", symbol: "ton" },
    ],
    conversions: {
      mg: 1,
      g: 1000,
      kg: 1000000,
      oz: 28349.5,
      lb: 453592,
      ton: 907185000,
    },
  },

  volume: {
    id: "volume",
    name: "Volume",
    units: [
      { id: "ml", name: "Milliliters", symbol: "ml" },
      { id: "l", name: "Liters", symbol: "L" },
      { id: "cup", name: "Cups", symbol: "cup" },
      { id: "pt", name: "Pints", symbol: "pt" },
      { id: "qt", name: "Quarts", symbol: "qt" },
      { id: "gal", name: "Gallons", symbol: "gal" },
      { id: "m3", name: "Cubic Meters", symbol: "m³" },
    ],
    conversions: {
      ml: 1,
      l: 1000,
      cup: 236.588,
      pt: 473.176,
      qt: 946.353,
      gal: 3785.41,
      m3: 1000000,
    },
  },

  temperature: {
    id: "temperature",
    name: "Temperature",
    units: [
      { id: "c", name: "Celsius", symbol: "°C" },
      { id: "f", name: "Fahrenheit", symbol: "°F" },
      { id: "k", name: "Kelvin", symbol: "K" },
    ],
    conversions: {
      ml: 1,
      l: 1000,
      cup: 236.588,
      pt: 473.176,
      qt: 946.353,
      gal: 3785.41,
      m3: 1000000,
    },
  },

  // area: {
  //   id: 'area',
  //   name: 'Area',
  //   icon: 'Square',
  //   measurementMethod: 'AR-Calculated', // Measure 2 sides
  //   units: [
  //     { id: 'mm2', name: 'Square Millimeters', symbol: 'mm²' },
  //     { id: 'cm2', name: 'Square Centimeters', symbol: 'cm²' },
  //     { id: 'm2', name: 'Square Meters', symbol: 'm²' },
  //     { id: 'in2', name: 'Square Inches', symbol: 'in²' },
  //     { id: 'ft2', name: 'Square Feet', symbol: 'ft²' },
  //     { id: 'acre', name: 'Acres', symbol: 'acre' }
  //   ],
  //   conversions: {
  //     mm2: 1,
  //     cm2: 100,
  //     m2: 1000000,
  //     in2: 645.16,
  //     ft2: 92903.04,
  //     acre: 4046856422.4
  //   }
  // }
};
export function convertUnits(value: number, from: string, to: string): number {
  const mmValue = value * conversionToMm[from];
  return mmValue / conversionToMm[to];
}

export function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  dimension: DimensionId,
): {
  baseValue: number;
  result: number;
} {
  const dim = DIMENSIONS[dimension];

  // Special case: Temperature (non-linear)
  // if (dimension === 'temperature') {
  //   return convertTemperature(value, fromUnit, toUnit);
  // }

  // Linear conversions (Length, Weight, Volume, Area)
  const baseValue = value * dim.conversions[fromUnit];
  console.log("converted value", baseValue);
  const result = baseValue / dim.conversions[toUnit];

  return {
    baseValue,
    result,
  };
}

// function convertTemperature(value: number, from: string, to: string) {
//   // Convert to Celsius first
//   let celsius;
//   if (from === "c") celsius = value;
//   else if (from === "f") celsius = ((value - 32) * 5) / 9;
//   else if (from === "k") celsius = value - 273.15;

//   // Convert from Celsius to target
//   if (to === "c") return celsius;
//   else if (to === "f") return (celsius * 9) / 5 + 32;
//   else if (to === "k") return celsius + 273.15;
// }
