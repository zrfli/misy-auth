export function maskString(value: string, start: number, end: number): string {
  const maskedLength = value.length - (start + end);
  if (maskedLength <= 0) return value;

  return (
    value.slice(0, start) +
    "*".repeat(maskedLength) +
    value.slice(value.length - end)
  );
}