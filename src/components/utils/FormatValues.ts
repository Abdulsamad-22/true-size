export default function formattedValue(convertedValue: number) {
  const formattedValue = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: convertedValue % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(convertedValue);
  return formattedValue;
}

export function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-NG", {
    dateStyle: "long",
  });
}
