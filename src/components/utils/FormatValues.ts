export default function formattedValue(convertedValue: number) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: convertedValue % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(convertedValue);
  return formattedValue;
}
