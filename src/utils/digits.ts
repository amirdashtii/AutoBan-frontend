export function toPersianDigits(
  input: string | number | null | undefined
): string {
  if (input === null || input === undefined) return "";
  const str = String(input);
  const map: Record<string, string> = {
    "0": "۰",
    "1": "۱",
    "2": "۲",
    "3": "۳",
    "4": "۴",
    "5": "۵",
    "6": "۶",
    "7": "۷",
    "8": "۸",
    "9": "۹",
  };
  return str.replace(/[0-9]/g, (d) => map[d]);
}

export function toEnglishDigits(
  input: string | number | null | undefined
): string {
  if (input === null || input === undefined) return "";
  const str = String(input);
  const map: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  return str.replace(/[۰-۹]/g, (d) => map[d]);
}
