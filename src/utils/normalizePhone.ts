// @/utils/normalizePhone.ts
export const bnToEnNumber = (str: string) => {
  const map: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return str.replace(/[০-৯]/g, (ch) => map[ch] ?? ch);
};

export const normalizePhone = (raw: string, trim = true): string => {
  const converted = bnToEnNumber(raw);
  let digitsOnly = converted.replace(/\D+/g, "");

  if (digitsOnly.startsWith("880")) {
    digitsOnly = "0" + digitsOnly.slice(3);
  }

  if (trim && digitsOnly.length > 11) {
    digitsOnly = digitsOnly.slice(0, 11);
  }

  return digitsOnly;
};
